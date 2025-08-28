require('dotenv').config()
const express = require('express');
const cors = require('cors')
const db = require("./config/db"); 
const crawlerController = require('./controllers/crawlerController');
const jobController = require("./controllers/jobController");

const app =express();
app.use(cors());

app.get("/run-crawler", crawlerController.runCrawler);
app.get("/jobs", jobController.getJobs);

app.listen(process.env.PORT,()=>{
  console.log(`listening at port ${process.env.PORT}`);
})