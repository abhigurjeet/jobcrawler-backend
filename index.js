require('dotenv').config()
const express = require('express');

const app =express();

app.get('/',async(req,res)=>{
    res.send('HELLO FROM BACKEND');
})

app.listen(process.env.PORT,()=>{
    console.log(`listening at port ${process.env.PORT}`);
})