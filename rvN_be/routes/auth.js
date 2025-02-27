const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {User, OTP,Authority,CentralAdmin} = require('../models/User');


const generateSixDigitCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString().padStart(6, '0');
};





const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // Create a Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'service' instead of 'host' for Gmail
      auth: {
        user: 'patilnimish27@gmail.com', // Replace with your Gmail
        pass: process.env.Email_pass, // Use an App Password, not your regular Gmail password
      },
    });

    // Setup email options
    const mailOptions = {
      from: '"UniGrievance Team" <patilnimish27@gmail.com>', // Your email address
      to: email, // Recipient's email
      subject: 'UniGrievance - Your Verification Code',
      text: `Dear User,

Thank you for signing up with UniGrievance. To complete your verification, please use the following code:

Verification Code: ${verificationCode}

If you did not request this code, please ignore this email.

Best Regards,  
UniGrievance Team`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error.message);
    throw new Error('Failed to send verification code via email. Please try again.');
  }
};




// Register a new user
router.post('/send-verification-code', async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;

    // Generate a random 6-digit code
    const verificationCode = generateSixDigitCode();

    // Save the verification code and email to the OTP model
    await OTP.create({
      email,
      otp: verificationCode,
    });

    // Send the verification code via SMS
   // await sendVerificationCode(phoneNumber, verificationCode);

    // Send the verification code via email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, verificationCode } = req.body;

    // Retrieve the stored verification code from the OTP model
    const otpRecord = await OTP.findOne({ email, otp: verificationCode });

    // Check if the provided code matches the stored code
    if (otpRecord) {
      // Delete the stored verification code from the OTP model
      await OTP.deleteOne({ _id: otpRecord._id });

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
      });

      const savedUser = await newUser.save();

      // Send registration success email
      await sendRegistrationSuccessEmail(email);

      res.status(201).json(savedUser);
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const sendRegistrationSuccessEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'service' instead of 'host' for Gmail
      auth: {
        user: 'patilnimish27@gmail.com', // Replace with your Gmail
        pass: process.env.Email_pass, // Use an App Password
      },
    });

    const mailOptions = {
      from: '"UniGrievance Team" <patilnimish27@gmail.com>',
      to: email,
      subject: 'Welcome to UniGrievance - Registration Successful',
      text: `Dear User,

Congratulations! Your registration with UniGrievance has been successfully completed.

We are excited to have you on board and look forward to assisting you. If you have any questions or need support, feel free to reach out.

Best Regards,  
UniGrievance Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error.message);
    throw new Error('Failed to send registration success email. Please try again.');
  }
};





// Step 2: Verify the user's phone number and save registration details
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, verificationCode } = req.body;

    // Retrieve the stored verification code from the OTP model
    const otpRecord = await OTP.findOne({ email, otp: verificationCode });
    console.log(otpRecord)

    // Check if the provided code matches the stored code
    if (otpRecord) {
      // Delete the stored verification code from the OTP model
      await OTP.deleteOne({ _id: otpRecord._id });

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
      });

      const savedUser = await newUser.save();

      res.status(201).json(savedUser);
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user with the provided username exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // If the credentials are valid, generate a JWT token with a 1-hour expiration
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '1h', // You can adjust the token expiration time
      });
      const role = 'user'
      // Send the token back to the frontend
      res.json({ token ,role, userId:user._id});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/localauthoritylogin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user with the provided username exists
      const user = await Authority.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // If the credentials are valid, generate a JWT token with a 1-hour expiration
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '1h', // You can adjust the token expiration time
      });
      const role = 'localauthority'
      // Send the token back to the frontend
      res.json({ token ,role, userId:user._id});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });






  router.post('/centeraladminlogin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user with the provided username exists
      const user = await CentralAdmin.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // If the credentials are valid, generate a JWT token with a 1-hour expiration
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '1h', // You can adjust the token expiration time
      });
      const role = 'centeraladmin'
      // Send the token back to the frontend
      res.json({ token ,role, userId:user._id});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.post('/logout', (req, res) => {
    // Assuming the client is storing the JWT token in an HTTP-only cookie named 'token'
    res.clearCookie('token'); 
  
    
  
    res.json({ message: 'Logout successful' });
  });


  router.post('/centraladminregister', async (req, res) => {
    try {
      const { username, email, password, age, post, publicid, premiseid } = req.body;
  
      // Check if the username or email already exists
      const existingUser = await CentralAdmin.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new central admin instance
      const newCentralAdmin = new CentralAdmin({
        username,
        email,
        password: hashedPassword,
        age,
        post,
        publicid,
        premiseid,
      });
  
      // Save the new central admin to the database
      await newCentralAdmin.save();
  
      res.status(201).json({ message: 'Central admin registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/authorityregister', async (req, res) => {
    const {
      username,
      email,
      password,
      age,
      department,
      post,
      publicid,
      premiseid
    } = req.body;
  
    try {
      // Check if the username or email already exists
      const existingAuthority = await Authority.findOne({ $or: [{ username }, { email }] });
      if (existingAuthority) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new authority instance
      const newAuthority = new Authority({
        username,
        email,
        password: hashedPassword, // Hash the password before saving to the database
        age,
        department,
        post,
        publicid,
        premiseid,
        reportsAssigned: [] // Initially no reports assigned
      });
  
      // Save the new authority to the database
      await newAuthority.save();
  
      // Return success response
      return res.status(201).json({ message: "Authority registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });






module.exports = router;
