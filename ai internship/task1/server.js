const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON requests

// In-memory data (replace with a database in a real app)
const users = {};
const questions = {};
const answers = {};

// Routes
app.post('/users', (req, res) => {
  const { username } = req.body;
  if (!users[username]) {
    users[username] = { points: 0 };
    res.status(201).send({ message: 'User created' });
  } else {
    res.status(400).send({ message: 'User already exists' });
  }
});

app.get('/users/:username', (req, res) => {
  const { username } = req.params;
  const user = users[username];
  if (user) {
    res.send({ points: user.points });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

app.post('/answers', (req, res) => {
  const { username, questionId, answerText } = req.body;
  if (users[username]) {
    const answerId = Date.now().toString(); // Simple ID generation
    answers[answerId] = { username, answerText, upvotes: 0, downvotes: 0 };
    users[username].points += 5;
    res.status(201).send({ message: 'Answer added', answerId });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

app.post('/answers/:answerId/upvote', (req, res) => {
  const { answerId } = req.params;
  if (answers[answerId]) {
    answers[answerId].upvotes++;
    if (answers[answerId].upvotes % 5 === 0) {
      users[answers[answerId].username].points += 5;
    }
    res.send({ message: 'Upvoted' });
  } else {
    res.status(404).send({ message: 'Answer not found' });
  }
});

app.post('/answers/:answerId/downvote', (req, res) => {
  const { answerId } = req.params;
  if (answers[answerId]) {
    answers[answerId].downvotes++;
    users[answers[answerId].username].points -= 1;
    res.send({message: 'Downvoted'});
  } else {
    res.status(404).send({message: 'Answer not found'});
  }
});

app.delete('/answers/:answerId', (req, res) => {
  const { answerId } = req.params;
  if (answers[answerId]) {
    const totalPoints = Math.floor(answers[answerId].upvotes / 5) * 5;
    users[answers[answerId].username].points -= (totalPoints + 5);
    delete answers[answerId];
    res.send({message: 'Answer removed'});
  } else {
    res.status(404).send({message: 'Answer not found'});
  }
});

app.post('/users/:username/transfer', (req, res) => {
  const { username } = req.params;
  const { recipient, amount } = req.body;
  if (users[username] && users[recipient]) {
    if (users[username].points >= 10 && users[username].points >= amount) {
      users[username].points -= amount;
      users[recipient].points += amount;
      res.send({ message: 'Points transferred' });
    } else {
      res.status(400).send({ message: 'Insufficient points' });
    }
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});