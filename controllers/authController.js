const db=require("../config/db");

const bcrypt=require("bcryptjs");

const jwt=require("jsonwebtoken");

exports.register=(req,res)=>{

const {name,email,password}=req.body;

bcrypt.hash(password,10,(err,hash)=>{

if(err)

return res.status(500).json(err);

db.query(

"INSERT INTO users(name,email,password) VALUES(?,?,?)",

[name,email,hash],

(err)=>{

if(err)

return res.status(500).json(err);

res.status(201).json("User Registered");

}

);

});

};



exports.login=(req,res)=>{

const {email,password}=req.body;

db.query(

"SELECT * FROM users WHERE email=?",

[email],

async(err,data)=>{

if(err)

return res.status(500).json(err);

if(!data.length)

return res.status(404).json("User not found");

const valid=

await bcrypt.compare(

password,

data[0].password

);

if(!valid)

return res.status(401).json("Wrong password");

const token=jwt.sign(

{id:data[0].id},

process.env.JWT_SECRET

);

res.json({

message:"Login Success",

token

});

}

);

};