const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/taskManagement");
    console.log("successfully connected to db !!");
  } catch (err) {
    console.log("Error occured !!", err);
  }
};

module.exports = { connectDB };
