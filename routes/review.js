const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../Models/review");
const Listing = require("../Models/listing.js");

const validateReview = (req,res,next) =>{
    let {error} =  reviewSchema.validate(req.body);
   // console.log(result);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
  }

  router.post("/", validateReview, wrapAsync(async (req,res) =>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    console.log(newReview);
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing.id}`);
  })
  );
  
  router.delete("/:reviewId",wrapAsync(async (req,res) =>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(id);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
    console.log("Review Deleted");

  }));

  module.exports = router;