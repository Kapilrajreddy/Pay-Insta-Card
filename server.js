const express = require("express")
const mysql = require("mysql")

const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const app=express()
app.use(cors())
app.use(bodyParser.json());
const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"root1234",
  database:"payinsta"
})

db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("connected")
    }
})

app.listen(3005, () => {
  console.log("listening on port 3005");
});



app.post("/register", async (request, response) => {
  const { username,email,password } = request.body;
 
  const hashedPassword = await bcrypt.hash(password, 10);
  
  
  const selectUserQuery = `SELECT * FROM signup WHERE email = '${email}';`;
  db.query(selectUserQuery, async (selectError, selectResult) => {
    if (selectError) {
      console.error('Error:', selectError);
      response.status(500).send('Internal Server Error');
    } else {
      if (selectResult.length === 0) {
        
        
        
       
        const createUserQuery = `
          INSERT INTO signup (username,email,password)
          VALUES (?, ?, ?);
        `;

        db.query(createUserQuery, [username,email,hashedPassword], (createError, createResult) => {
          if (createError) {
            console.error('Error:', createError);
            response.status(500).send({ error_msg: 'Internal Server Error' });
          } else {
            response.send({ success_msg: 'User created successfully' });
          }
        });
      } else {
        response.status(400).send({ error_msg: 'User already exists' });
      }
    }
  });
});


app.post("/login", async (request, response) => {
    const { email, password } = request.body;
    
    if (!email || !password) {
      response.status(400).send({ error_msg: "Email and password are required" });
      return;
    }
  
    const selectUserQuery = "SELECT * FROM signup WHERE email = ?;";
    db.query(selectUserQuery, [email], async (selectError, selectResult) => {
      if (selectError) {
        console.error("Error:", selectError);
        response.status(500).send("Internal Server Error");
      } else {
        console.log(selectResult)
        if (selectResult.length === 0) {
          response.status(400).send({ error_msg: "Invalid user" });
        } else {
          const databaseUser = selectResult[0];
          
          
          const isPasswordMatched = await bcrypt.compare(password, databaseUser.password);
          console.log(isPasswordMatched)
          if (isPasswordMatched === true) {
            const payload = {
              email: email,
            };
            const jwt_token = jwt.sign(payload, "MY_SECRET_TOKEN");
            response.send({ jwt_token });
          } else {
            response.status(400).send({ error_msg: "Invalid password" });
          }
        }
      }
    });
  });
  
 
  
  
  
  
  
  


