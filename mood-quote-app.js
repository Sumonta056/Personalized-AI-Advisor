// mood-quote-app.js

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:3001", // Allow requests from the frontend
    })
);

// Configure Gemini API Key from .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route to handle user input and return motivations and tips
app.post("/get-quote", async (req, res) => {
    const { mood, name, profession } = req.body;

    if (!mood || !name || !profession) {
        return res.status(400).json({ error: "Mood, name, and profession are required" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `My mood is ${mood}, my name is ${name}, and I am a ${profession}. Can you provide motivational advice and tips specific to my situation?`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        res.json({ mood, name, profession, advice: responseText });
    } catch (error) {
        console.error("Error fetching advice:", error.message);
        res.status(500).json({ error: "Failed to fetch advice" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Mood Quote app listening at http://localhost:${port}`);
});
