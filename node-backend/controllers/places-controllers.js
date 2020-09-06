const HttpError = require("../models/http-error");
const {validationResult}=require("express-validator")
const { v4: uuid } = require('uuid');
const getCoordsForAddress=require("../util/location")
let DUMMY_PLACES = [
    {
      id: "p1",
      title: "Empire State Building",
      description: "One of the most famous sky scrapers in the world!",
      location: {
        lat: 40.784474,
        lng: -73.9871516,
      },
      address: "20 W 34th St, New York, NY 10001",
      creator: "u1",
    },
  ];
  

const getPlaceById=(req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => {
      return p.id === placeId;
    });
    if (!place) {
      throw new HttpError("Could not find a place for the provided id.", 404);
    }
    res.json({ place });
  };




  const getPlacesByUserId=(req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter((p) => {
      return p.creator === userId;  //condition
    });

    if (!places ||places.length===0) {
      return next(
        new HttpError("Could not find places for the provided user id.", 404)
      );
    }
    res.json({ places });
    //{place} ==={place:place}
  }



  const createPlace=async(req,res,next)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){ //if errors is not empty 
      return next(new HttpError("Invalid inputs passed,please check your data.", 422));
    }

    const {title,description,address,creator} = req.body;  //const tilte=req.body.title
    let coordinates;
    try{
      coordinates=await getCoordsForAddress(address);
    }catch(error){
      return next(error);
    }
    
    const createdPlace={
      id:uuid(),
      title,  //title:title, 
      description,
      location:coordinates,
      address,
      creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({places: createdPlace})
  }



  const updatePlace=(req,res,next)=>{

    const errors =validationResult(req);
    if(errors.isEmpty()===false){ //if errors is not empty 
      console.log(errors);
      throw new HttpError("Invalid inputs passed,please check your data.", 422);
    }   // this block of code is the error handling code

    const placeId=req.params.pid;
    const {title,description} = req.body;
    const updatePlace={...DUMMY_PLACES.find(p=>p.id=placeId)}; //creates a copy of that place(we need to create a copy here or else it will directly change the object , it is fine here but this is a good practice)
    const placeIndex= DUMMY_PLACES.findIndex(p=>p.id=placeId);
    updatePlace.title=title;
    updatePlace.description=description;

    DUMMY_PLACES[placeIndex]=updatePlace;
    res.status(200).json({place:updatePlace});
  }



  const deletePlace=(req,res,next)=>{
    const placeId=req.params.pid;
    if(!DUMMY_PLACES.find(p=>{p.id===placeId})){
      throw new HttpError("Could not find a place for that id.",404)
    }
    DUMMY_PLACES=DUMMY_PLACES.filter(p => p.id !== placeId)   //return all the p.id that does not match the condition
    res.status(200).json({message:"Deleted Places"});
  }








  
  exports.getPlaceById=getPlaceById;
  exports.getPlacesByUserId=getPlacesByUserId;
  exports.createPlace=createPlace;
  exports.updatePlace=updatePlace;
  exports.deletePlace=deletePlace