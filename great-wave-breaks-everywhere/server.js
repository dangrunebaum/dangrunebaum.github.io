// filepath: /Users/dangrunebaum/Dropbox/PROJECTS/great-wave-image-search/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = ["http://localhost:8080", "https://your-production-url.com"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization"
}));

app.get("/api/images", async (req, res) => {
    const userQuery = req.query.q || "";
    const searchQuery = `great wave off kanagawa ${userQuery}`;
    
    // Log the search query to verify the input term is included
    console.log(`Received request with query: ${req.query.q}`);
    console.log(`Search Query: ${searchQuery}`);
    
    try {
        const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.GOOGLE_CSE_ID,
                searchType: "image",
                q: searchQuery,
                num: 10
            }
        });

        console.log(`API response received with ${response.data.items.length} items`);
        res.json(response.data.items);
    } catch (error) {
        console.error("Error fetching images from Google API", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Process terminated");
    });
});