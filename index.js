const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const users = [
  {"email":"hassanga@gmail.com","username":"hasanga","id": 111,"password":"123456"},
  {"email":"bob@gmail.com","username":"bobCholo","id":222,"password":"1223abc"},
  {"email":"david@gmail.com","username":"david","id":333,"password":"256cvb"}
];

app.get("/api", (req, res) => {
    res.json({
      message: "Hello there ehis is first route",
    });
  });

app.post("/api/login", (req, res) => {
  console.log("req data", req.body.password, req.body.email);
  try{
    users.filter((user) => {
    if (user.email === req.body.email) {
      if (user.password === req.body.password) {
        console.log(user);
        const payload = {
          id: user.id,
        };

        jwt.sign(payload, "shhh", { expiresIn: "10h" }, (err, token) => {
          res.json({
            token: token,
          });
          console.log(token);
        });
     }
    }
  });
}catch{
    res.json({
        message:"Mensajito de errocito"
    })
}
});

app.post('/api/posts',verifyToken,(req,res)=>{

    jwt.verify(req.token,'shhh',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message:"blog posted",
                authData:authData
            })
        }
    })
})

function verifyToken(req,res,next){
    const bearerHeader=req.headers['authorization'];
    if(typeof bearerHeader!=='undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken=bearer[1];
        req.token=bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
