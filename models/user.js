const mongoose = require("mongoose");
//why we are not upload in config folder in model user folder bcoz avatar is speific to user 
const multer=require('multer');
const path= require('path');
// we will define which path the img is stored
const AVATAR_PATH=path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar:{
     type:String

    }
  },
  {
    timestamps: true,
  }
);


   //to link multer abd avatar schema and to store img
   //for stroeing img
   let storage = multer.diskStorage({
    //cb call back fun and for cb 1st arguments null and 2nd argument path
    destination: function (req, file, cb) {
       //models(user.js)+".."+ uploads/users/avatars
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //fieldname is avatar 
      //in which format it stores
      cb(null, file.fieldname + '-' + Date.now());
    }
  });

   //static function
    // single says only one file can be uploaded for avatar not multiple file
    userSchema.statics.uploadedAvatar=multer({ storage: storage }).single('avatar');
    //we need avatar path available publicly for user model 
    userSchema.statics.avatarPath=AVATAR_PATH;

// tell mongoose that User is a model and needs to be exported
const User = mongoose.model("User", userSchema);

module.exports = User;