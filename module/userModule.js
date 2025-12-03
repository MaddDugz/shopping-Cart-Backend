const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// create user schema
const usershema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
    }
})

usershema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
})

module.exports = mongoose.model('user', usershema);
