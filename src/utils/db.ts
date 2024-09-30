import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
  };
  
  const connection: ConnectionObject = {};

export const dbConnect = async() : Promise<void> =>{

    if(connection.isConnected){
        console.log("Database is already connected");
        return;
    }


    try {
        const url = process.env.MONGODB_URI || "";
        console.log(process.env.MONGODB_URI);
        
        console.log(url);
        
        const db = await mongoose.connect(url)

        connection.isConnected = db.connections[0].readyState
        console.log("db connected")
    } catch (error) {
        console.log(error)
        console.log("Error connecting to database");
        
    }}