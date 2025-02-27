const express = require('express');
const router = express.Router();
//const { YearlyData, endangeredSpecies, Visitor } = require('../models/periodic');
const { Message, UserReport, User } = require('../models/User');
const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = require('natural');

// Initialize the sentiment analyzer for English
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

// Import the 'natural' package
const natural = require('natural');

// Use PorterStemmer from 'natural'
const stemmer = natural.PorterStemmer;

// GET route to fetch yearly data details
router.get('/getyearlydata/:parkName', async (req, res) => {
    try {
      const parkName = req.params.parkName;
      const yearlyData = await YearlyData.find({ parkName: parkName });
      res.json(yearlyData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
router.post('/postyearlydata', async (req, res) => {
    try {
      const { parkName, year, flora, fauna } = req.body;
  
      // Create a new YearlyData instance
      const newYearlyData = new YearlyData({
        parkName,
        year,
        flora,
        fauna,
      });
  
      // Save the new yearly data to the database
      await newYearlyData.save();
  
      res.status(201).json({ message: 'Yearly data added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/postEndangeredSpecies', async (req, res) => {
    try {
        const { parkName, year, rhino, tiger, asianElephant, wildWaterBuffalo, gaur, easternSwampDeer, sambarDeer } = req.body;

        const newEndangeredSpecies = new endangeredSpecies({
            parkName,
            year,
            rhino,
            tiger,
            asianElephant,
            wildWaterBuffalo,
            gaur,
            easternSwampDeer,
            sambarDeer,
        });

        await newEndangeredSpecies.save();

        res.status(201).json({ message: 'Endangered species data created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/getEndangeredSpecies/:parkName/:year', async (req, res) => {
  try {
    const { parkName, year } = req.params;
    const endangeredSpeciesData = await endangeredSpecies.findOne({ parkName });
    
    if (!endangeredSpeciesData) {
      return res.status(404).json({ message: 'Data not found for the specified park and year' });
    }

    res.json(endangeredSpeciesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/add-visitor', async (req, res) => {
  try {
    const { name, id, rfid, nationality, intime, outtime } = req.body;

    console.log('Received values:', { name, id, rfid, nationality, intime, outtime });

    // Parse intime and outtime from JSON format to Date objects
    const parsedIntime = intime ? new Date(intime) : null;
const parsedOuttime = outtime ? new Date(outtime) : null;

if (!parsedIntime || isNaN(parsedIntime.valueOf()) || !parsedOuttime || isNaN(parsedOuttime.valueOf())) {
  return res.status(400).json({ message: 'Invalid date format in request' });
}

const visitor = new Visitor({
  name,
  id,
  rfid,
  nationality,
  inTime: parsedIntime,
  outTime: parsedOuttime,
});
    await visitor.save();

    res.status(201).json({ message: 'Visitor added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.get('/get-all-visitors', async (req, res) => {
  try {
    const allVisitors = await Visitor.find();
    res.status(200).json(allVisitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






router.post('/sendmessages', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const newMessage = new Message({ sender, receiver, content });
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get messages between two users
router.get('/messages/:userId/:receiverId', async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    // Find messages where sender is userId and receiver is receiverId
    const messagesFromUser = await Message.find({
      sender: userId,
      receiver: receiverId,
    }).sort({ timestamp: 1 });
    console.log('Messages from user:', messagesFromUser);

    // Find messages where sender is receiverId and receiver is userId
    const messagesToUser = await Message.find({
      sender: receiverId,
      receiver: userId,
    }).sort({ timestamp: 1 });
    console.log('Messages to user:', messagesToUser);

    // Combine the two arrays
    const messages = [...messagesFromUser, ...messagesToUser];

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/priority-analysis', async (req, res) => {
  try {
    // Retrieve all user reports from the database
    const userReports = await UserReport.find();

    // Perform sentiment analysis on each user report and determine priority
    const priorities = userReports.map(report => {
      const priority = analyzeSentiment(report.title, report.description);
      return { _id: report._id, priority };
    });

    res.json(priorities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to analyze sentiment of title and description
function analyzeSentiment(title, description) {
  // Tokenize and stem the text for analysis
  const tokenizer = new natural.WordTokenizer();
  const titleTokens = tokenizer.tokenize(title);
  const descriptionTokens = tokenizer.tokenize(description);
  const titleStems = titleTokens.map(token => stemmer.stem(token));
  const descriptionStems = descriptionTokens.map(token => stemmer.stem(token));

  // Calculate sentiment scores for title and description
  const titleScore = analyzer.getSentiment(titleStems);
  const descriptionScore = analyzer.getSentiment(descriptionStems);

  // Combine scores or use other criteria to determine priority
  const overallScore = (titleScore + descriptionScore) / 2;
  let priority;

  // Assign priority based on sentiment score
  if (overallScore < 0) {
    priority = 'Medium';
  } else if (overallScore < 2) {
    priority = 'low';
  } else {
    priority = 'High';
  }

  return priority;
}







module.exports = router;