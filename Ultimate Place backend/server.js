const fs=require("fs");
const path=require("path");
const express=require("express");
const bodyParser=require("body-parser");
const placesRoutes=require("./routes/places-routes");
const usersRoutes=require("./routes/users-routes.js")
const HttpError=require("./models/http-error");
const mongoose=require("mongoose")
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/uploads/images",express.static(path.join("uploads","images")));



app.use((req,res,next)=>{
res.setHeader("Access-Control-Allow-Origin","*")   // The * determains what domain is allowed, we can put localhost but with * its all domain 
res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE");
  next();
})


app.use("/api/places",placesRoutes)

app.use("/api/users",usersRoutes);




app.use((req,res,next)=>{   //this routes is only used when the previous routes aren't reached so it is an error handling route, if no routes specify, it will reach all routes
const error=new HttpError("Could not find this route.",404);
throw error;   //when ever we throw the error, the error handling middleware gets it 
});


app.use((error,req,res,next)=>{   //this middleware function will excute when any routes throw an error ,or the next function is being called
  if(req.file){
fs.unlink(req.file.path,err=>{
  console.log(err);
});
  }
    if(res.headerSent){
        return next(error);
    }
  res.status(error.code ||500);
  res.json({message:error.message||"An unknown error occurred!"})
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ns8ky.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{app.listen(5000,()=>{
    console.log("server running on port 5000 ");
})}
).catch(err=>{
  console.log(err);
});



