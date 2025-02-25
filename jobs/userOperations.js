const User = require('../models/userSchema');

const registerUser = async (username, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error('Username already exists');
  const newUser = new User({ username, password });
  await newUser.save();
  return { username: newUser.username, id: newUser._id };
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not registered. Please register first.');
  if (user.password !== password) throw new Error('Incorrect password.');
  return { username: user.username, id: user._id };
};

const fetchUserData = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

const updateUserScore = async (userId, newScore, prizeWon) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { 
      $set: { counter: newScore, lastUpdated: new Date() },
      $inc: { prizes: prizeWon }
    },
    { new: true }
  );
  return user;
};

module.exports = { registerUser, loginUser, fetchUserData, updateUserScore };