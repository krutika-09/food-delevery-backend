// Importing all required external modules after installation
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require("bcryptjs");

// Middleware
const PORT = 3000;
const app = express();
app.use(express.json());

// Connecting mongoose atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected successfully..."))
  .catch((err) => console.log(err));

// API landing page http://localhost:3000/
app.get("/", async (req, res) => {
    try {
        res.send("<h1 align:center>welcome to the backend and week 2</h1>");
    } catch (err) {
        console.log(err);
    }
});

// API registration page http://localhost:3000/register
app.post("/register", async (req, res) => {
    const { user, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10); // Fixed hashPassword
        const newUser = new User({ user, email, password: hashPassword }); // Corrected password hash
        await newUser.save();
        console.log('New User is registered successfully...');
        res.json({ message: 'User created....' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// API login page
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Fixed the syntax here

    try {
        const user = await User.findOne({ email: email });
        if (!user || !(await bcrypt.compare(password, user.password))) { // Corrected the logic
            return res.status(400).json({ message: "Invalid credentials" }); // Fixed the status and response
        }
        res.json({ message: "Login Successfully", username: user.username });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Server running and testing atlas
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port " + PORT);
});
