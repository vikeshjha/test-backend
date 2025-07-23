const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.post('/signup', async(req , res) => {
    try{
        const { name , password }= req.body;
        const newUser = new User({ name, password});
        await newUser.save();
        res.status(201).json({message: "User created"});
    }
    catch(err) {
        res.status(500).json({error: 'Server error'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => console.log(`Server running on port ${PORT}`));

