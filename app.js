var express = require("express"),
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

require('dotenv').config();

const uri = process.env.MONGO_URL;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

/*var plants=[
    {name:"Alovera",image:"https://i.ytimg.com/vi/AHlJuY0bagA/maxresdefault.jpg"},
    {name: "Neem",image: "https://images.unsplash.com/photo-1564505676257-57af8f7e43ab?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8bmVlbSUyMHBsYW50fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}
]*/

var plantSchema = new mongoose.Schema({
    name: String,
    image: String,
});

var Plant = mongoose.model("Plant", plantSchema);

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
            res.render("plants", {plants: allplants});        
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

app.get("/plants/new",function(req,res){
    res.render("new.ejs");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server started on port ${port}'));