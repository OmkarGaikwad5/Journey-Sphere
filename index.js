const express = require("express");
const app = express();
const port = 8081;

const mongoose = require("mongoose");
const path = require("path");

const Listing = require("./Models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./Models/review");
const listingsRouter = require("./routes/listing");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");



app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const MONGO_URL = "mongodb://127.0.0.1:27017/JourneySphere";
main()
.then(() =>{
    console.log("Connected To DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};

app.get("/",(req,res) =>{
  res.send("Working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// app.get("/register",async(req,res) =>{
//   const fakeUser = new User({
//     email: "gaikwadomkar",
//     username:"omkar-gaikwad",
//   });

//   let registeredUser = await User.register(fakeUser,"46004500");
//   res.send(registeredUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next) =>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next) =>{
 let{statusCode=500 ,message="Something Went Wrong"} = err;
 res.render("listings/error.ejs",{message});
 //res.status(statusCode).send(message);
})

  app.listen(8081,() =>{
    console.log(`Server Started Running On Port ${port}`);
})