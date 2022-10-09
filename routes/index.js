const express = require('express');
const router = express.Router();
const passport=require('passport');
router.use('/users',require('./users'));

//for api folder
router.use('/api',require('./api'));
module.exports=router;