import userModel from "../mongodb/models/userModel.js";

const getAllUsers = async(req, res) =>{

}; 

const createUsers = async(req, res) => {
   try { 
    const {name, email, avatar} = req.body;
    const userExists = await userModel.findOne({email}); 
    
    if(userExists) return res.status(201).json({message: "user exists"}); 
    const newUser = await userModel.create({
        name, 
        email, 
        avatar,
    }); 
    
         
        res.status(200).json(newUser); 
    } catch(err) {
        res.status(500).json({message: err.message}); 
    }

}; 

const getUserInfoById = async(req, res) => {

}

export {
    getAllUsers, 
    createUsers, 
    getUserInfoById,
}