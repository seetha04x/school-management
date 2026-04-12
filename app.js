const express=require("express");
const app=express();
const mysql=require("mysql2");
const joi=require("joi");
// Load .env file, but don't override existing environment variables
require("dotenv").config({ override: false });

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Support both DB_* (local) and MYSQL* (Railway) environment variable names
const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306
};

// Validate required environment variables
const requiredKeys = ['host', 'user', 'password', 'database'];
const missingKeys = requiredKeys.filter(key => !dbConfig[key]);
if(missingKeys.length > 0) {
    console.error(`Missing required database configuration: ${missingKeys.join(', ')}`);
    console.error('Please set environment variables:');
    console.error('  Local: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    console.error('  Railway: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE');
    process.exit(1);
}

const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

connection.connect((err)=>{
    if(err) {
        console.error("Database connection failed:", err.message);
        console.error("Attempted connection to:", dbConfig.host);
        process.exit(1);
    }
    console.log("connected to database");
});

// Handle connection errors after initial connect
connection.on('error', (err) => {
    console.error("Database error:", err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error("Database connection was closed.");
    }
    if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.error("Database had a fatal error.");
    }
    if(err.code === 'PROTOCOL_ENQUEUE_AFTER_CLOSE') {
        console.error("Database connection was manually closed.");
    }
});

const server = app.listen(3000, ()=>{
    console.log("listening to 3000");
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server');
    server.close(() => {
        connection.end();
        process.exit(0);
    });
});
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

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).send({message: "Internal server error"});
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit - log and continue
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});