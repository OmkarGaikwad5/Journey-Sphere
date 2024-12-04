const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const newListings = require("../Models/listing.js");

const listingController = require("../Controllers/listing.js");

const validateListing = (req,res,next) =>{
  console.log(req.body);
  let {error} =  listingSchema.validate(req.body);
//  console.log(result);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
   throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}


router.route("/")
.get (wrapAsync(listingController.index))
.post( isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewForm)


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));
 
  

 module.exports = router;