const express= require('express');
const path= require('path')

const {open}= require('sqlite');
const sqlite3 = require('sqlite3')

const dbPath= path.join(__dirname,"users.db");

let db = null;
const cors= require('cors')

const app=express();

app.use(express.json());
app.use(cors());


const initializeDBAndServer=async()=>{
    try {
        db = await open({ filename: dbPath, driver: sqlite3.Database });
        app.listen(4000, () => {
          console.log("Server Running at http://localhost:4000/");
        });
      } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(-1);
      }

}

initializeDBAndServer();

//Login Api 

app.post("/login/",async(request,response)=>{
   
    const values=[
        request.body.emailId,
        request.body.password
    ]
    const selectUserQuery=`SELECT * FROM User WHERE emailId='${values.emailId}' AND password='${values.password}'`;
    const dbUser= await db.get(selectUserQuery);
    if (dbUser === undefined){
        response.status(400);
        response.send("Invalid User")
    }else{
        response.status(200);
        response.send("Login Successfully");
    }
})

// Register Api 

app.post("/signup",async(request,response)=>{
   
    const values=[
        request.body.emailId,
        request.body.username,
        request.body.assword
    ]

    const selectUserQuery= `SELECT * FROM User WHERE emailId='${values.emailId}'`;

    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined){

        const createUserQuery=`INSERT INTO User(emailId,username,password)
                                            VALUES('${values.emailId}','${values.username}','${values.password}');
        
        `;

        await db.run(createUserQuery);
        response.send('User Created Successfully');
    }else{
        response.status(400);
        response.send("User Already Exist");
    }


})
app.get('/',(req,res)=>{
    res.send('Welcome to Our Website');
})

app.get('/userlist',async(req,res)=>{
    const selectUserQuery=`SELECT * FROM User`
    const dbUsers= await db.all(selectUserQuery);
    res.send(dbUsers);
})