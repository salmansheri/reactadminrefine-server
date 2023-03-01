import userModel from "../mongodb/models/userModel.js";

const getAllUsers = async(req, res) =>{

    try {
        const users = await userModel.find({}).limit(req.query._end);
        res.status(200).json(users); 


    } catch(err) {
        res.status(500).json({message: err.message});
        console.log(err); 
    }

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

    try {
        const {id} = req.params; 
        const user = await userModel.findOne({_id: id}).populate("allProperties"); 
    
        if(user) res.status(200).json(user); 
    
        else res.status(404).json({message: 'user not found'}); 

    } catch(err) {
        res.status(500).json({message: err.message}); 
        console.log(err); 
    }
   

}

export {
    getAllUsers, 
    createUsers, 
    getUserInfoById,
}