const Listing = require("./Models/listing.js");
const Review = require("./Models/review.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You need to be logged in to create new listing");
       return res.redirect("/login");
      }
      next();
};


module.exports.saveRedirectUrl = (req,res,next) => {
     if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
     }
     next();
}

module.exports.isOwner = async(req,res,next) =>{
    const { id } = req.params;
    let listingid = await Listing.findById(id);
    if(!listingid.owner._id.equals(res.locals.owner) ){
        req.flash("error","You Don't Have Permission To Edit This");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) =>{
    let { id,reviewId } = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id) ){
        req.flash("error","You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}