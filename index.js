require('dotenv').config()
const express = require('express');
const cors = require('cors')

const app =express();
app.use(cors({
    origin: "http://localhost:5173"
  }));
app.get('/',async(req,res)=>{
    res.send('HELLO FROM BACKEND');
})

app.listen(process.env.PORT,()=>{
    console.log(`listening at port ${process.env.PORT}`);
})