import express from 'express';
import dotenv from 'dotenv';
// import {router} from "next/client.js";
import cors from "cors"
import userRouter from "./routes/user.routes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    try {
        res.status(200).send('Hello World!');
    } catch(e){
        res.status(500).send({message : "Something went wrong"});
    }
})

app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
})