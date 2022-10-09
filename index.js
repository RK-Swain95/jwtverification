const express=require('express');
const cookieparser=require('cookie-parser');
const app=express();
const port=8002;
const cookieparser=require('cookie-parser');
const expresslayouts=require('express-ejs-layouts');
//db
const db=require('./config/mongoose');

const passportJWT=require('./config/passport-jwt-strategy');

const path=require('path');


//used for session cookie
const session=require('express-session');
const passport=require('passport');


const passportLocal=require('./config/passport-local-strategy');


const MongoStore=require('connect-mongo');


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

//mongo store is used to store session cookie in the db
app.use(session({
    //name of the section cookie
    name:'codeial',
    //todo change the secret before deployment in production mode
    //encodeing
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    //it store the section information even if server is restart ,its remain in the memory/database so that sign in user dont get reset even server restart, that info does not get lost
    store: MongoStore.create(
        {
           mongoUrl:'mongodb://localhost:27017/placement_cell',
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect mongo db setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


//use express router
app.use('/',require('./routes'));



app.listen(port,function(err){
    if(err){
        console.log(`Error:${err}`);
    }
    console.log(`server is running on port:${port}`);
});