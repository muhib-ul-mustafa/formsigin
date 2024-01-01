const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://admin:wasiawan@cluster0.tz4yg0e.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
  console.log("connection made successfully")
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB server');
});

// Schema and User Model declaration
const userSchema = new mongoose.Schema({
  txt: String,
  email: String,
  pswd: String,
});

const User = mongoose.model('data', userSchema);

// Signup route
app.post('/sign', (req, res) => {
  const { txt, email, pswd } = req.body;

  const data = {
    txt,
    email,
    pswd,
  };

  const newUser = new User(data);

  newUser.save()
    .then(() => {
      res.send('Signup successful!');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Server error');
    });
});

app.get('/login', (req, res) => {
  const { email, pswd } = req.query; // Use req.query to get parameters from a GET request

  User.findOne({ email, pswd })
    .then((user) => {
      if (user) {
        // You can implement user authentication logic here
        // For simplicity, let's just send a success message
        res.send('Login successful!');
      } else {
        res.status(401).send('Invalid email or password');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Server error');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
