// const mongoose=require("mongoose")

// const userSchema=new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     banned: {
//         type: Boolean,
//         default: false // Initially, the user is not banned
//     },
    
// });
   
   


// const User=mongoose.model('user',userSchema)


// module.exports=User

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  banned: {
    type: Boolean,
    default: false // Initially, the user is not banned
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
