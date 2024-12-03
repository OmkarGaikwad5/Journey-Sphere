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