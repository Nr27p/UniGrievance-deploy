const express = require('express');
const multer = require('multer');
const { UserReport, Authority, User , Message, CentralAdmin } = require('../models/User');
const { jwtDecode } = require('jwt-decode');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');
const router = express.Router();


// Function to classify priority using Meta Llama 2
const classifyPriorityWithHuggingFace = async (title, description) => {
  const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
  

  let retries = 3; // Number of retry attempts

  while (retries > 0) {
    try {
      const res = await axios.post(
        API_URL,
        {
          inputs: `${title}. ${description}`,
          parameters: { 
            candidate_labels: ["HIGH", "MEDIUM", "LOW"]
          }
        },
        {
          // ${API_KEY}
          headers: { Authorization: `Bearer ${process.env.HUGAPI_KEY}`,
            "Content-Type": "application/json",
           },
          timeout: 30 * 1000 // Increased timeout (30 seconds)
        }
      );

      const labels = res.data.labels;
      const scores = res.data.scores;
      const highestIndex = scores.indexOf(Math.max(...scores));
      const priority = labels[highestIndex];

      console.log("🔹 Hugging Face AI Response:", res.data);
      return priority;
    } catch (error) {
      console.error(`🔴 Hugging Face API Error (Attempt ${4 - retries}):`, error.response?.data || error.message);
      retries--;

      // If it's a timeout, retry
      if (error.code === 'ECONNABORTED' || error.message.includes('Read timed out')) {
        console.warn("⚠️ Retrying Hugging Face API request...");
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      } else {
        break; // If it's another error (e.g., API down), exit retry loop
      }
    }
  }

  console.error("🔴 All Hugging Face API attempts failed. Returning default priority: LOW");
  return "LOW"; // Default priority if all attempts fail
};


const detectScamWithGemini = async (title, description) => {
  try {
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API}`;
      
      const payload = {
          contents: [
              {
                  parts: [
                      { text: `Classify the following report as "scam" or "real". ONLY respond with either "scam" or "real". Do not explain anything.\n\nTitle: ${title}\nDescription: ${description}` }
                  ]
              }
          ]
      };

      const response = await axios.post(GEMINI_API_URL, payload, {
          headers: { "Content-Type": "application/json" }
      });

      // ✅ Extract response properly
      const geminiResult = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

      console.log("Gemini API Response:", geminiResult); // Debugging line

      return geminiResult === "scam"; // Returns true if classified as "scam", otherwise false

  } catch (error) {
      console.error("Error detecting scam with Gemini:", error.response?.data || error.message);
      return false; // Default to "not a scam" if the API fails
  }
};


const detectScamWithMistral = async (title, description) => {
    try {
        const response = await axios.post(
            "https://api.mistral.ai/v1/chat/completions",
            {
                model: "mistral-small",
                messages: [
                    {
                        role: "user",
                        content: `Classify the following report as 'scam' or 'real'. 
                        A 'scam' report contains false or misleading information, exaggerated claims, or fake grievances. 
                        A 'real' report describes genuine issues like broken pipelines, contaminated water, or supply interruptions. 
                        Only respond with either 'scam' or 'real'.\n\n
                        Title: ${title}\nDescription: ${description}`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MISTRAL_API}`,
                    "Content-Type": "application/json",
                }
            }
        );

        // Extract classification result
        const prediction = response.data.choices[0]?.message?.content?.trim().toLowerCase();
        return prediction;
    } catch (error) {
        console.error("Mistral API Error:", error.response?.data || error.message);
        return "error"; // Default response in case of failure
    }
};


// Endpoint to post user reports
router.post("/postUserReports", async (req, res) => {
  try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwtDecode(token);

      const { title, description, location, department, image } = req.body;

      // ✅ Step 1: Classify Priority using Hugging Face (Meta Llama 2) - Bard's response
      const bardResult = await classifyPriorityWithHuggingFace(title, description);

      // 🔹 Convert Bard's priority result to scam decision
      const isScamBard = bardResult.toUpperCase() === "LOW"; // LOW = Scam, HIGH & MEDIUM = Not a Scam

      // ✅ Step 2: Set Due Date Based on Priority
      let dueDays = 7; // Default (low priority)
      if (bardResult.toUpperCase() === "HIGH") dueDays = 1;
      else if (bardResult.toUpperCase() === "MEDIUM") dueDays = 3;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDays);

      // ✅ Step 3: Run Scam Detection on Three AIs
      const isScamGemini = await detectScamWithGemini(title, description);
      const isScamMistral = await detectScamWithMistral(title, description);

      console.log("🔹 Gemini AI Result:", isScamGemini ? "Scam" : "Not Scam");
      console.log("🔹 Mistral AI Result:", isScamMistral ? "Scam" : "Not Scam");
      console.log("🔹 Bard AI Result (Priority):", bardResult, `(${isScamBard ? "Scam" : "Not Scam"})`);

      // ✅ Step 4: Decide Based on Majority Vote
      const scamVotes = [isScamGemini, isScamMistral, isScamBard].filter(vote => vote).length;
      const isFinalScam = scamVotes >= 2; // If 2 or more AIs say scam, classify as scam

      console.log("🔹 Final Scam Decision:", isFinalScam ? "Rejected (Scam)" : "Accepted (Not Scam)");

      const status = isFinalScam ? "rejected" : "accepted"; // If scam, reject immediately

      // ✅ Step 5: Create a new UserReport instance
      const newUserReport = new UserReport({
          title,
          description,
          location,
          image,
          department,
          priority: bardResult, // Bard's priority used as final priority
          status,
          createdBy: decoded.userId,
          dueDate,
          statusHistory: [
              {
                  status: status,
                  updatedBy: "System",
                  updatedByName: "System",
                  timestamp: new Date(),
              }
          ],
      });
      // ✅ Step 6: Save the report
      await newUserReport.save();

      // ✅ Step 7: If accepted (not a scam), auto-assign to Local Authority
      let assignedAuthority = null;
      if (!isFinalScam) {
          assignedAuthority = await assignReportToAuthority(newUserReport._id, department);
          if (assignedAuthority) {
              newUserReport.assignedTo = assignedAuthority._id;
              await newUserReport.save();
          }
      }
      const userId = decoded.userId;
      const userEmail = await getUserEmailById(userId);
      await sendReportStatusEmail(userEmail, title, status,dueDate);
      // ✅ Step 8: Send Response (Mistral and Bard Results Only in Logs, Not in DB)
      res.status(201).json({
          message: "User report created and processed successfully",
          geminiResult: isScamGemini ? "Scam" : "Not Scam",
          bardResult: bardResult, // Only for debugging
          mistralResult: isScamMistral ? "Scam" : "Not Scam", // Only for debugging
          finalDecision: isFinalScam ? "Scam" : "Not Scam",
          assignedAuthority
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});


const getUserEmailById = async (userId) => {
  try {
    // Find user in MongoDB by ID
    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ User not found!");
      return null;
    }

    // console.log(`📧 Retrieved Email: ${user.email}`);
    return user.email;
  } catch (error) {
    console.error("❌ Error fetching user email:", error.message);
    return null;
  }
};


const assignReportToAuthority = async (reportId, department) => {
  try {
      // Find an available authority in the department
      const authority = await Authority.findOne({ department });

      if (!authority) {
          console.log(`No authority found for department: ${department}`);
          return null;
      }

      // Assign report to authority
      authority.reportsAssigned.push(reportId);
      await authority.save();

      // Update the report with assigned authority
      await UserReport.findByIdAndUpdate(reportId, { assignedTo: authority._id });

      console.log(`Report ${reportId} assigned to ${authority.username}`);
      return authority;
  } catch (error) {
      console.error("Error assigning report to authority:", error);
      return null;
  }
};


router.get('/reportstatus/:status', async (req, res) => {
    try {
  
      const { status } = req.params;
  
      // Find all user reports with status 'pending'
      const reports = await UserReport.find({ status: status });
  
      // Send the list of pending reports as a response
      res.json(reports);
      //console.log(reports)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


// Function to send status update email
const sendReportUpdateEmail = async (email, title, status, updatedByName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "patilnimish27@gmail.com", // Replace with your Gmail
        pass: process.env.Email_pass, // Use an App Password
      },
    });

    const mailOptions = {
      from: '"UniGrievance Team" <patilnimish27@gmail.com>',
      to: email,
      subject: `Your Report Status Update: ${status.toUpperCase()}`,
      text: `Dear User,

Your report titled "${title}" has been updated by ${updatedByName} depart. The new status is: ${status.toUpperCase()}.

${
  status === "resolved"
    ? "Your report has been successfully resolved. Thank you for your patience."
    : status === "escalated"
    ? "Your report has been escalated to a higher authority for further review."
    : "Your report status has been updated."
}

If you have any concerns, feel free to reach out.

Best Regards,  
UniGrievance Team`,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Report status email sent to ${email}`);
  } catch (error) {
    console.error("Error sending report status email:", error.message);
  }
};


// Function to send user report status email
const sendReportStatusEmail = async (email, title, status,dueDate) => {
  try {
    // Calculate remaining days from today until dueDate
    const today = new Date();
    const due = new Date(dueDate);
    const timeDifference = due - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Format the due date as a readable string (e.g., February 15, 2025)
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDueDate = due.toLocaleDateString("en-US", options);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "patilnimish27@gmail.com", // Replace with your Gmail
        pass: process.env.Email_pass, // Use an App Password
      },
    });

    const mailOptions = {
      from: '"UniGrievance Team" <patilnimish27@gmail.com>',
      to: email,
      subject: `Your Report Status: ${status === "accepted" ? "Accepted" : "Rejected"}`,
      text: `Dear User,

Your report titled "${title}" has been reviewed and the final decision is: ${status.toUpperCase()}.

${
  status === "accepted"
    ? `Your report has been accepted and assigned to the appropriate department. You can expect a response within ${daysRemaining} days, by ${formattedDueDate}.`
    : "Unfortunately, your report has been rejected as it has been identified as fraudulent"
}

If you have any concerns, feel free to reach out.

Best Regards,  
UniGrievance Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Report status email sent to ${email}`);
  } catch (error) {
    console.error("Error sending report status email:", error.message);
  }
};


router.post('/updateReportStatus/:reportId', async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwtDecode(token);
        const userId = decoded.userId; // Extract user ID from token

        // Find the user from CentralAdmin, Authority, or User collections
        let user = await CentralAdmin.findById(userId) || await Authority.findById(userId);
        if (!user) return res.status(403).json({ message: 'Unauthorized role' });

        const updatedByName = user.username; // ✅ Get actual username

        // Define valid statuses for Authorities
        const validAuthorityStatus = ['in-progress', 'resolved', 'escalated'];

        // Find the report
        const userReport = await UserReport.findById(reportId);
        if (!userReport) return res.status(404).json({ message: 'User report not found' });

        // ✅ Allow only Local Authorities to set these statuses
        
        userReport.status = status;
        const usernameId=userReport.createdBy;
        const userEmailId=await getUserEmailById(usernameId);
        

        // ✅ Log status change in statusHistory
        userReport.statusHistory.push({
            status: status,
            updatedBy: userId, // Stores user ID
            updatedByName: updatedByName, // ✅ Stores actual username
            timestamp: new Date(),
        });

        await userReport.save();

        // ✅ Send email notification
    await sendReportUpdateEmail(
      userEmailId, 
      userReport.title,
      status,
      updatedByName
    );
        res.status(200).json({ message: `Report status updated to ${status}`, userReport });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/assignReport/:reportId/:department', async (req, res) => {
    try {
      const { reportId } = req.params;
      const { department } = req.params;
      // const token = req.headers.authorization;
      // const decoded = jwtDecode(token);

      const userReport = await UserReport.findById(reportId );

      if (!userReport) {
        return res.status(404).json({ message: 'User report not found' });
      }

      // Find the Authority document based on the admin parameter (assuming admin is the username)
       // Define username variable with appropriate value

      const authority = await Authority.findOne({ department });

      if (!authority) {
        return res.status(404).json({ message: 'Authority not found' });
      }

      // Update the reportsAssigned field of the Authority document
      authority.reportsAssigned.push(userReport._id);

      // Save the updated Authority document
      await authority.save();

      res.json(userReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/getReportsAssigned', async (req, res) => {
  try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded = jwtDecode(token);

      // Find the Authority document based on the provided ID
      const authority = await Authority.findById(decoded.userId);
      if (!authority) {
          return res.status(404).json({ message: 'Authority not found' });
      }

      // Retrieve assigned reports and include status history
      const assignedReports = await UserReport.find({ _id: { $in: authority.reportsAssigned } })
          .populate('statusHistory.updatedBy', 'username'); // ✅ Fetch the username of the person who updated status

      // Ensure `updatedByName` is included for each status update
      const reportsWithUpdatedByName = assignedReports.map(report => {
          report.statusHistory = report.statusHistory.map(entry => ({
              status: entry.status,
              updatedBy: entry.updatedBy?._id || null, // Keep user ID
              updatedByName: entry.updatedBy?.username || entry.updatedByName || "Unknown User", // ✅ Ensure username is returned
              timestamp: entry.timestamp,
          }));
          return report;
      });

      res.json(reportsWithUpdatedByName);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/recent-user-reports', async (req, res) => {
    try {
      // Calculate the date and time 1 hour ago
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
      // Query for user reports created in the last 1 hour
      const recentUserReports = await UserReport.find({
        createdAt: { $gte: oneHourAgo },
      });
  
      // Check if the count is more than 5
      const reportCount = recentUserReports.length;
  
      if (reportCount > 5) {
        // Send an alert to the frontend
        res.json({
          message: `Alert: ${reportCount} reports generated in the last 1 hour.`,
          reports: recentUserReports,
          showAlert: true,
        });
      } else {
        // No alert, just return an empty response
        res.json({});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/getuserreports/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find reports posted by the user with the provided user ID
      const userReports = await UserReport.find({ createdBy: userId });
  
      if (!userReports) {
        return res.status(404).json({ message: 'No reports found for this user' });
      }
  
      res.status(200).json(userReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


router.get("/getOverdueReports", async (req, res) => {
    try {
        const currentDate = new Date();

        // Find overdue reports with "accepted" or "in-progress" statuses
        const overdueReports = await UserReport.find({ 
            dueDate: { $lt: currentDate }, 
            status: { $in: ["accepted", "in-progress"] } 
        }).populate({
            path: "assignedTo",
            select: "username email department post" // ✅ Get only required fields
        });

        if (!overdueReports || overdueReports.length === 0) {
            return res.status(404).json({ message: "No overdue reports found" });
        }

        res.status(200).json(overdueReports);
    } catch (error) {
        console.error("Error fetching overdue reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/messagesExists', async (req, res) => {
    try {
      // Extract the token from the request headers
      const token = req.headers.authorization;
      
      // Decode the token to get the user's ID
      const decoded = jwtDecode(token);
    
      // Find the User document based on the provided ID
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Use the User's ID as the receiverId
      const receiverId = user._id;
  
      // Query the Message model to find messages for the provided receiverId
      const messages = await Message.find({ receiver: receiverId });
  
      // Send the messages as a response
      res.status(200).json(messages);
      //console.log(messages)
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;