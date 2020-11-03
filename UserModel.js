const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    unique:true
  },
  nameReal:{
type:String,
trim:true,

  },
  surname:{
 type:String,
 trim:true,
  },
  receiveData:{
    type:Boolean,
  },
  UserId:{
 type:Number
  },
  messages:{
    type:String,
  },
  phoneNum:{
    type:String,
    trim:true,
    unique:true
  }
})

const UserModel = mongoose.model('User',userSchema)
module.exports = UserModel