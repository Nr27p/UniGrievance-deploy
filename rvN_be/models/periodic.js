const mongoose = require('mongoose');

const yearlydataSchema = new mongoose.Schema({
  parkName: {
    type: String,
    required: true,
  },
    year: {
    type: Number,
    required: true,
  },
  flora: {
    type: Number,
    required: true,
  },
  fauna: {
    type: Number,
    required: true,
  },
});


const endangeredSpeciesSchema = new mongoose.Schema({

    parkName: {
        type: String,
        required: true,
      },
    year: {
        type: Number
      },
    rhino: {
      type: Number,
      default: 0,
    },
    tiger: {
      type: Number,
      default: 0,
    },
    asianElephant: {
      type: Number,
      default: 0,
    },
    wildWaterBuffalo: {
      type: Number,
      default: 0,
    },
    gaur: {
      type: Number,
      default: 0,
    },
    easternSwampDeer: {
      type: Number,
      default: 0,
    },
    sambarDeer: {
      type: Number,
      default: 0,
    },
  });



  const visitorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    rfid: {
      type: String,
      required: true,
      unique: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    inTime: {
      type: Date,
      required: true,
    },
    outTime: {
      type: Date,
      required: true,
    },
  });
  
  const Visitor = mongoose.model('Visitor', visitorSchema);
  
  const endangeredSpecies = mongoose.model('EndangeredSpecies', endangeredSpeciesSchema);



const YearlyData = mongoose.model('YearlyData', yearlydataSchema);

module.exports = {YearlyData,endangeredSpecies,Visitor};