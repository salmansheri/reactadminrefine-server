import express from 'express'; 

import dotenv from 'dotenv'; 
import cors from 'cors'; 
import connectDB from './mongodb/connect.js';
import user from './routes/user.routes.js';
import property from './routes/property.routes.js';

dotenv.config(); 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 

app.get("/",(req, res) => {
    res.status(200).json({message: "hello world"});  
}); 

app.use('/api/v1/user', user); 
app.use('/api/v1/properties', property); 

const startServer = async () => {
    try {
        connectDB(process.env.MONGO_URI); 
        app.listen(process.env.PORT, () => console.log(`Server running on Port ${process.env.PORT}`))

    } catch (error) {
        console.log(error); 
    }
}

startServer(); 

