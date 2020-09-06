const express=require("express");
const bodyParser=require("body-parser");
const placesRoutes=require("./routes/places-routes");
const usersRoutes=require("./routes/user-routes.js")
const HttpError=require("./models/http-error");
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/places",placesRoutes)

app.use("/api/users",usersRoutes);




app.use((req,res,next)=>{   //this routes is only used when the previous routes aren't reached so it is an error handling route, if no routes specify, it will reach all routes
const error=new HttpError("Could not find this route.",404);
throw error;   //when ever we throw the error, the error handling middleware gets it 
});


app.use((error,req,res,next)=>{   //this middleware function will excute when any routes throw an error ,or the next function is being called
    if(res.headerSent){
        return next(error);
    }
  res.status(error.code ||500);
  res.json({message:error.message||"An unknown error occurred!"})
})


app.listen(5000,()=>{
    console.log("server running on port 5000 ");
})