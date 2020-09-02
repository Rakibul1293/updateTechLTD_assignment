const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const userInfoRoutes = require('./api/routes/userInfoRoutes.tsx');

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/api", userInfoRoutes);

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));