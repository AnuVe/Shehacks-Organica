var express = require("express"),
    app = express(), 
    bodyParser = require("body-parser"), 
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    Plant = require("./models/plant"),
    Comment=require("./models/comment"),
    User = require("./models/user.js"),
    seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    plantRoutes = require("./routes/plants"),
    indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.use( express.static( "public" ) );
app.set("view engine","ejs");
app.use(methodOverride("_method"));
require('dotenv').config();

const uri = process.env.MONGO_URL;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.use(require("express-session")({
    secret: "abcd",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/plants",plantRoutes);
app.use("/plants/:id/comments",commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));