import express from "express";

import {
  getAllUsers,
  createUsers,
  getUserInfoById,
} from "../controllers/user.controller.js";


const router = express.Router(); 


router.route('/').get(getAllUsers); 
router.route('/').post(createUsers); 
router.route('/:id').get(getUserInfoById); 

export default router; 