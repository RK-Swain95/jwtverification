const express = require('express');
const router = express.Router();
const usersApi=require('../../controllers/api/user');

router.post('/createsession',usersApi.createsession);
module.exports=router;