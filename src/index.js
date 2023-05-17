// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
SECRET_KEY="Gautam";
const cors = require("cors");

const app = express();
// Connecting to MongoDB database
mongoose.connect("mongodb+srv://Jenn:Janki6121@cluster0.vqk5j27.mongodb.net/?retryWrites=true&w=majority", //{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
).then(() => {
    
app.listen(8000, () => {
    console.log('Server started on port 5000!');
});
    console.log('Connected to MongoDB database!');
}).catch((error) => {
    console.error('Error connecting to MongoDB database:', error);
});

app.use(cors());
// Defining user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
        , required: true
    }
});

// Creating User model from user schema
const User = mongoose.model('User', userSchema);

// Creating an instance of express app

// Parsing incoming requests with JSON payloads
app.use(bodyParser.json());

// Route for user sign-up
app.post('/signup', async (req, res) => {
    // Get user data from request body
    const { name, email, password } = req.body;
    const existing =await User.findOne({email});
    // Create a new User document from user data
    if (existing) {
        return res.json({message:"Already"});
    }
    const user = await new User({ name, email, password });
    // Save the User document to MongoDB database
    user.save().then(() => {
        // Send success response
            const token = jwt.sign({"email": user.email,"id":user._id},SECRET_KEY);
            res.status(200).json({"user":user,"token":token})
    }).catch((error) => {
        // Send error response
        res.status(402).json({ message: 'Error signing up user!' });
    });
});

// Route for user sign-in
app.get('/signin', async (req, res) => {
    // Get user credentials from request body
    const { email, password } = req.body;

    const existing= await User.findOne({email});
    if (existing) {
        const pass= await User.findOne({password});
        if (pass) {
            const token = jwt.sign({"email": existing.email,"id":existing._id},SECRET_KEY);
            res.status(201).json({"user":existing,"token":token})        }
        else{
            res.json({message:"Wrong pass"})
        }
    }
    else{
        res.json({message:"Not valid"})
    }
    
    // Send response

});

// Starting the server
