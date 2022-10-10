const User=require('../models/user');
const path=require('path');
const fs=require('fs');
const jwt=require('jsonwebtoken');

//get sign up data
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email : req.body.email},function(err,user){
        if(err){
            console.log('error in finding user in sign up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error in creating user in sign up');
                    return;
                } 
                return res.redirect('/users/sign-in');
            })
           
        } else{
            return res.redirect('/users/sign-in');
        }
    })

}
module.exports.signup=function(req,res){
   
    return res.render('user_sign_up',{title:'Sign up'});
}
//sign in
module.exports.signin=function(req,res){
    //if the person sign in redirect to profile page and dont not open sign in page
  
    return res.render('user_sign_in',{title:'Sign in'});
}


//profile
module.exports.profile = async function (req, res) {
    // if(req.user){
    //     console.log(req.user);
    //     return res.render('user_profile',{title:'profile'});
    // }else{
    //     return res.redirect("/users/sign-in");
    // }
    if(req.cookies.jwt){
        
        try{
            const token=req.cookies.jwt;
           
            const verifyuser=jwt.verify(token,'codeial');
            
            console.log(verifyuser);
            if(verifyuser){
                return res.render('user_profile',
                {title:'profile',
                user:verifyuser
             });
 
             }

        }catch (error){
            console.log(error);
            return res.redirect('/users/sign-in');
        }

    }else{
        return res.status(401).send('error');
    }
}



//for update in profile page
module.exports.update= async function(req,res){
    // to check if any other person change pasram is in html so for athenticate
    console.log("me");
    const token=req.cookies.jwt;
    const verifyuser=jwt.verify(token,process.env.key);
   
    if(verifyuser._id==req.params.id){
        try{
            let user=await  User.findByIdAndUpdate(req.params.id);
            console.log(user+"user find");
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log(' ****multer error',err);
                }
                 //console.log(req.file+"file");
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                //if avatar is already present delete it
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                }



                    //this is saving the path of the uploaded file into avatar field in user
                    user.avatar=path.join(User.avatarPath,req.file.filename);
                }
                user.save();
                 var token=jwt.sign(user.toJSON(),process.env.key,{expiresIn:'1000000'});
                //handle session creation
                 res.cookie('jwt',token);
                 return res.redirect('/users/profile');
            });

        }catch(err){
            console.log("error update");
        
            return res.redirect('back');
        }
    }else{
        
        return res.status(401).send('unauthorized');
    }
}