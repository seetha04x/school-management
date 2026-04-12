const express=require("express");
const app=express();
const mysql=require("mysql2");
const joi=require("joi");
require("dotenv").config();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "pswd",
    database: process.env.DB_NAME || "school",
    port: process.env.DB_PORT || 3306
});
connection.connect((err)=>{
    if(err) throw err;
    console.log("connected to database");})
    
app.listen(3000, ()=>{
    console.log("listening to 3000");
})
const schoolSchema=joi.object({
    name:joi.string().required(),
    address:joi.string().required(),
    latitude:joi.number().required(),
    longitude:joi.number().required()
})
app.post("/addSchool", (req,res)=>{
    const {error,value}=schoolSchema.validate(req.body);
    if(error){
        res.status(400).send({message:error.details[0].message});
        return;
    }
    const sql="insert into schools(name, address, latitude, longitude) values(?,?,?,?)";
    connection.query(sql,[value.name,value.address,value.latitude,value.longitude],(err,result)=>{
        if(err){
            res.status(500).send({message:"database error"});
            return;
        }
        res.status(201).send({message:"School Added successfully"});
    })
})
app.get("/listSchools",(req,res)=>{
    const latitude=req.query.latitude;
    const longitude=req.query.longitude;
    if(!latitude || !longitude){
        res.status(400).send({message:"latitude and longitude are required"});
        return;
    }  
    const userLocation={latitude: parseFloat(latitude), longitude: parseFloat(longitude)}; 
    const sql="select * from schools";
    connection.query(sql,(err,results)=>{
        if(err){
            res.status(500).send({message:"database error"});
            return;
        }
       const sortedSchools=results.map(school=>{
            const distance=Math.sqrt(Math.pow(school.latitude-userLocation.latitude,2)+Math.pow(school.longitude-userLocation.longitude,2));
            return {...school, distance};
        }).sort((a,b)=>a.distance-b.distance);
        res.status(200).send(sortedSchools);
    })
})