const express=require('express');
const dotenv=require("dotenv").config();
const cookieparser=require('cookie-parser');
const app=express();
const port=8002;


const expresslayouts=require('express-ejs-layouts');
//db
const db=require('./config/mongoose');

const passportJWT=require('./config/passport-jwt-strategy');

const path=require('path');


//used for session cookie
const session=require('express-session');
const passport=require('passport');




// const MongoStore=require('connect-mongo');


app.use(express.urlencoded());
app.use(cookieparser());
//make upload path is available for browser
app.use('/uploads',express.static(__dirname+ '/uploads'));
app.use(express.static('./assets'));


app.use(expresslayouts);
//extract styles ans scripts from sub pages into to layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);





//set up view engine
app.set('view engine','ejs');
app.set('views','./views');



app.use(passport.initialize());


//use express router
app.use('/',require('./routes'));



app.listen(port,function(err){
    if(err){
        console.log(`Error:${err}`);
    }
    console.log(`server is running on port:${port}`);
});