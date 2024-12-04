const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../Models/review");
const Listing = require("../Models/listing.js");
const { isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../Controllers/review.js");

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

  router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

  module.exports = router;