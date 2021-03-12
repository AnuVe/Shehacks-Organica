var express=require("express");
var app=express();
var bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var plants=[
    {name:"Alovera",image:"https://i.ytimg.com/vi/AHlJuY0bagA/maxresdefault.jpg"}
]


app.get("/",function(req,res){
    res.render("landing");
});

app.get("/plants",function(req,res){

    res.render("plants",{plants:plants});
});

app.post("/plants",function(req,res){
    //res.send("POST");
    var name = req.body.name;
    var image = req.body.image;
    var newplant = {name:name, image:image}
    plants.push(newplant);
    res.redirect("/plants");
});

app.get("/plants/new",function(req,res){
    res.render("new.ejs");
});

app.listen(8000,function(){
    console.log("Hello");
}); 