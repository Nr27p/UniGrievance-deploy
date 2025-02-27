const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');
const {Message} = require('./models/User');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;





app.use(cors());
app.use(cookieParser());
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});




app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/data', dataRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
