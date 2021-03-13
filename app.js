var express = require("express"),
    app = express(), 
    bodyParser = require("body-parser"), 
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    Plant = require("./models/plant"),
    Comment=require("./models/comment"),
    User = require("./models/user.js"),
    seedDB = require("./seeds")

app.use(bodyParser.urlencoded({extended:true}));
app.use( express.static( "public" ) );
app.set("view engine","ejs");
require('dotenv').config();

const uri = process.env.MONGO_URL;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

seedDB();

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

/*var plants=[
    {name:"Alovera",image:"https://i.ytimg.com/vi/AHlJuY0bagA/maxresdefault.jpg"},
    {name: "Neem",image: "https://images.unsplash.com/photo-1564505676257-57af8f7e43ab?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8bmVlbSUyMHBsYW50fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}
]*/

/*Plant.create(
    {
        name: "Alovera",
        image: "https://i.ytimg.com/vi/AHlJuY0bagA/maxresdefault.jpg"
    }, function(err, plant) {
        if(err) {
            console.log(err)
        } else {
            console.log("Newly created plant");
            console.log(plant);
        }
    });*/

    app.get("/",function(req,res){
    res.render("landing");
});

app.get("/plants",function(req,res){
    Plant.find({}, function(err, allplants){
        if(err) {
            console.log(err);
        } else {      
            res.render("plants/index", {plants: allplants});        
        }
    });
});

app.post("/plants",function(req,res){
    //res.send("POST");
    var name = req.body.name;
    var image = req.body.image;
    var newPlant = {name:name, image:image}
    Plant.create(newPlant, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/plants");
        }
    });
});

app.get("/plants/add/new",function(req,res){
    res.render("plants/new");
});

app.get("/plants/:id", function(req, res) {
        Plant.findById(req.params.id).populate("comments").exec(function(err, foundPlant) {
        if(err) {
            console.log(err);
        } else {
            res.render("plants/show",{plant: foundPlant});
        }
    });
});

app.get("/plants/:id/comments/new", isLoggedIn, function(req,res){
    Plant.findById(req.params.id, function(err,plant){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{plant:plant});
        }
    })
});

app.post("/plants/:id/comments", isLoggedIn, function(req,res){
    Plant.findById(req.params.id,function(err,plant){
        if(err){
            console.log(err);
            res.redirect("/plants");
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    plant.comments.push(comment);
                    plant.save();
                    res.redirect('/plants/'+plant._id);
                }
            });
        }
    });
});

app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/plants");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/plants",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/plants");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));