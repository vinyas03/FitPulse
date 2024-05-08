const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const axios = require("axios");
const cors = require("cors");

connectDB();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:3000";
//CORS setup
const corsOptions = {
  origin: FRONTEND_URL, // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed HTTP headers
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

//3rd-party Api config
const RapidAPIKey = process.env.RapidAPIKey;
//get the ingredient text from frontend
app.post("/api/scanfood", async (req, res) => {
  const text = req.body.text;
  //console.log('Text received from frontend:', text);
  const options = {
    method: "POST",
    url: "https://chatgpt-42.p.rapidapi.com/conversationgpt4",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": RapidAPIKey,
      "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
    },
    data: {
      messages: [
        {
          role: "user",
          content: `Examine these ingredients, and as a food/fitness/health advisor give your take in some sentences: ${text}`,
        },
      ],
      system_prompt: text,
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send("something went wrong");
  }
});

//get the muscle group text from frontend
app.post("/api/workoutfind", async (req, res) => {
  const text = req.body.text;
  console.log(text);

  const options = {
    method: "GET",
    //url: "https://work-out-api1.p.rapidapi.com/search",
    url: "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises",
    params: { muscle: text },
    headers: {
      "X-RapidAPI-Key": RapidAPIKey,
      "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      //"X-RapidAPI-Host": "work-out-api1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
