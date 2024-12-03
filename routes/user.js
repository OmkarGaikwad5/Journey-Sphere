const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res,next) =>{
   try {
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err) =>{
        if(err) {
            next(err);
        }
        req.flash("success","Welcome To Journey Sphere");
        res.redirect("/listings");
    })
   } catch (err) {
    req.flash("error",err.message);
    res.redirect("/signup");
   }
})
);

router.get("/login",(req,res) =>{
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true}),
    async(req,res) =>{
        
      req.flash("success","You Logged in successfully !!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next) =>{
    req.logOut((err) =>{
        if(err) {
            return next(err);
         };
         req.flash("success","Logged Out Successfully");
         res.redirect("/listings");
    })
})

module.exports = router;