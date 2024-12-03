const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const newListings = require("../Models/listing.js");

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

router.get("/", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
   })
 );
 
   router.get("/new",isLoggedIn,(req,res) =>{
     res.render("listings/new.ejs")
   });
 
 
   router.get("/:id", wrapAsync(async(req,res) =>{
      let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews").populate("owner");
   console.log(listing.owner);
     res.render("listings/show.ejs",{listing});
   })
 );
 router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const { listing } = req.body;
  const { title, description, image, price, country, location } = listing;

  let newListings;
  if (image !== "") {
      const newImage = {
          url: image
      };
      newListings = new Listing({ title, description, image: newImage, price, country, location });
  } else {
      newListings = new Listing({ title, description, price, country, location });
  }

  // Assign owner BEFORE saving
  newListings.owner = req.user.id;

  // Save the listing to the database
  await newListings.save();

  // Add success flash message
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}));
 
 router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs",{listing});
     
 })
 );
 
 router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const {listing} = req.body;
  const {title, description, image, price, location, country} = listing;
  const newImage = {
    url: image
  };
  console.log(newImage);
  await Listing.findByIdAndUpdate(id, { price, location, country, title, description, image: newImage });
  req.flash("success", "Listing Updated");
  res.redirect("/listings");
}));
 
 router.delete("/:id", isLoggedIn, wrapAsync(async(req,res) =>{
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success"," Listing Deleted");
     res.redirect("/listings");
 })
 );

 module.exports = router;