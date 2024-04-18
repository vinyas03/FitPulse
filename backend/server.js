const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const axios = require('axios');



connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

//ChatGPT Api config
const ChatGPTUrl = process.env.CHATGPT4URL;
const RapidAPIKey = process.env.RapidAPIKey;
const RapidAPIHost = process.env.RapidAPIHost;

//get the ingredient text from frontend
app.post('/api/scanfood', async (req, res) => {
  const text = req.body.text;
  //console.log('Text received from frontend:', text);
  const options = {
    method: 'POST',
    url: ChatGPTUrl,
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': RapidAPIKey,
      'X-RapidAPI-Host': RapidAPIHost
    },
    data: {
      messages: [
        {
          role: 'user',
          content: `Examine these ingredients, and as a food/fitness/health advisor give your take in some sentences: ${text}`
        }
      ],
      system_prompt: text,
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false
    }
    };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send('something went wrong');
  }

});

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
