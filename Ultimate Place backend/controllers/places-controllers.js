const fs=require("fs");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose=require("mongoose");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/places");
const User=require("../models/user");



const getPlaceById = async(req, res, next) => {
  const placeId = req.params.pid;
let place;
  try{
    place = await Place.findById(placeId);
  }catch(err){
    const error= new HttpError("Something went wrong, could not find a place.",500);
    return next(error);
  };
  
  if (!place) {
    const error=new HttpError("Could not find a place for the provided id.", 404);
    return next(error);
  }
  res.json({ place: place.toObject({getters:true}) });  //
};




const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try{
    places = await Place.find({creator:userId});
  }catch(err){
    const error=new HttpError("Fecthing places failed, please try again late",500);
    return next(error);
  }
  

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  res.json({ places:places.map(place=>place.toObject({getters:true})) });
  //{place} ==={place:place}
};




const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //if errors is not empty
    return next(
      new HttpError("Invalid inputs passed,please check your data.", 422)
    );
  }

  const { title, description, address } = req.body; //const tilte=req.body.title
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator:req.userData.userId
  });

  let user;

  try{
    user= await User.findById(req.userData.userId);
  }catch(err){
    const error= new HttpError("Creating place failed, please try again",500);
    return next(error);
  }
    if(!user){
      const error=new HttpError("Could not find user for provided id",404);
      return next(error);
    }

  try {
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session:sess});
    user.places.push(createdPlace);
    await user.save({session:sess});
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError("creatring place failed,please try again");
    return next(error);
  }

  res.status(201).json({ places: createdPlace });
};




const updatePlace = async(req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    //if errors is not empty
    console.log(errors);
  return next(new HttpError("Invalid inputs passed,please check your data.", 422));
  } // this block of code is the error handling code

  const placeId = req.params.pid;
  const { title, description } = req.body;
 
  let place;
  try{
    place=await Place.findById(placeId);
  }catch(err){
    const error=new HttpError("Something went wrong, could not update place",500);
    return next(error);
  }

if(place.creator.toString() !==req.userData.userId){
  const error=new HttpError("You are not allowed to edit this place",401);
    return next(error);
}



  place.title = title;
  place.description = description;
  try{
   await place.save();
  }catch(err){
    const error=new HttpError("Something went wrong, could not update place",500);
    return next(error);
  }
  
  res.status(200).json({ place: place.toObject({getters:true}) });
};





const deletePlace = async(req, res, next) => {
  const placeId = req.params.pid;


  let place;
  try{
    place= await Place.findById(placeId).populate("creator");
  }catch(err){
    const error=new HttpError("Something went wrong, could not delete place.",500);
    return next(error);
  }

   if(!place){
    const error=new HttpError("Could not find place for this id",500);
    return next(error);
   }

if(place.creator.id !==req.userData.userId){
  const error=new HttpError("You are not allowed to delete this place",401);
  return next(error);
}







const imagePath=place.image;

  try{
   const sess=await mongoose.startSession();
  sess.startTransaction();
   await place.remove({session:sess});  //remove from place
   place.creator.places.pull(place);   //romove from User place.creator links to user
   await place.creator.save({session:sess});
   await sess.commitTransaction();
  }catch(err){
    const error=new HttpError("Something went wrong, could not delete place.",500);
    return next(error);
  }
  fs.unlink(imagePath,err=>{
    console.log(err);
  });
  res.status(200).json({ message: "Deleted Places" });
};





exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
