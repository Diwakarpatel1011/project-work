const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('./cron/crm-sync');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow only your frontend
app.use(cors({
  origin: [
    'https://diwak.netlify.app/',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

app.use('/api/leads', require('./routes/leads'));

// MongoDB connect
mongoose.connect(
  process.env.MONGO_URI || 'mongodb+srv://rk4765505:Knb3QJ4YMEZZSjyV@cluster0.etpxc.mongodb.net/business-auth',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => {
  console.log('Connected to MongoDB');

  cron.start();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
