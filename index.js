require('dotenv').config()
const express = require('express');
const cors = require('cors')
const db = require("./db");
const crawlNoDesk = require('./crawler');

const app =express();
app.use(cors());
app.get("/run-crawler", async (req, res) => {
    const response = await crawlNoDesk(db);
    if (response.success) {
      res.json({ message: `Crawled ${response.count} jobs successfully` });
    } else {
      res.status(500).json({ error: response.error });
    }
  });
  
app.get("/jobs", (req, res) => {
    res.json("HELLO");
});
app.listen(process.env.PORT,()=>{
    console.log(`listening at port ${process.env.PORT}`);
})