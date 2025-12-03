const user = require("../module/userModule.js");
const bcrypt = require('bcrypt');

// Create User
const CreateUser = async (req, res) => {
  try {
    const newuser = await user.create(req.body);
    res.status(200).json({
      id: newuser._id,
      message: "User Created Successfully"
    });
  } catch (err) {
    console.error("Error:" + err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// login user
const LoginUser = async (req, res) => {
  try{
    const { name, password } = req.body;
    const existingUser = await user.findOne({ name });
      if(!existingUser){
        return res.status(404).json({ message: "User not found" });
      }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if(!isPasswordValid){
        return res.status(401).json({ message: "Invalid credentials" });
      }
    res.status(200).json({
      id: existingUser._id,
      message: "Login Successful"
    });
    
  }catch(err){
    console.error("Error:" + err.message);
    res.status(500).json({ message: "Server Error" });
  }
}
module.exports = { CreateUser, LoginUser };