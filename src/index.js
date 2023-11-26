import cors from 'cors'
import dotenv from "dotenv"
import connectDB from  "./database/db.js";
import { app } from './app.js'

dotenv.config({
  path: './.env'
})

app.use(cors());

//connect to database
connectDB()
  .then(
    app.listen(process.env.PORT || 4000, () =>{
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    })
  )
  .catch((error) =>
    console.error("MongoDB Connection failed!!! ", error.message)
  );
