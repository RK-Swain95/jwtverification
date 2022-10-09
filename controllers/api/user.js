const User=require('../../models/user');
//for json web token
const jwt=require('jsonwebtoken');





// module.exports.createsession=async function(req,res){
//     try{
//         let user=await User.findOne({email:req.body.email});
//          //if user is not found 
//          if(!user || user.password!=req.body.password){
//             return res.json(422,{
//                 message:"Invalid user name and password !!"
//             });
//          }
//          //if user is found
//          return res.json(200,{
//             message:"login in successfully keeep the token safe !!",
//             //generating the token
//             data:{
//                 token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'1000000'})
//             }
//         });
//     }catch(err){
//         return res.json(500,{
//             message:"Internal server error !!"
//         });
//     }

   

// }
module.exports.createsession=function(req,res){
    //find the user
    console.log("token");
    User.findOne({email : req.body.email},function(err,user){
        if(err){
            console.log('error in finding user in sign in');
            return;
        }
         //handle user found
         if(user){
            //handle password if not match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
          var token=jwt.sign(user.toJSON(),'codeial',{expiresIn:'1000000'});
         // console.log(token);
            //handle session creation
            res.cookie('jwt',token);
            return res.redirect('/users/profile');


         }else{
            //handle user not found
            return res.redirect('back');

         }

    });   

}