const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { generateRandomOutcome, calculateNewScore } = require('./jobs/counterOperations');
const { registerUser, loginUser, fetchUserData, updateUserScore } = require('./jobs/userOperations');

const app = express();
app.use(express.json());
app.use(cors());

// Here are the project parameters
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message }); // Return specific error message
  }
});

app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await fetchUserData(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.post('/api/click/:userId', async (req, res) => {
  try {
    const user = await fetchUserData(req.params.userId);
    const { bonus, prize } = generateRandomOutcome();
    const newScore = calculateNewScore(user.counter, bonus);
    const updatedUser = await updateUserScore(user._id, newScore, prize);
    
    res.json({
      counter: updatedUser.counter,
      prizes: updatedUser.prizes,
      bonus: bonus > 0 ? 'You got 10 bonus points!' : null,
      prize: prize > 0 ? 'You won a prize!' : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Click processing failed' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));