var express = require("express"),
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose");
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    path = require("path"),
    crypto = require("crypto"),
    multer = require("multer"),
    GridFsStorage = require("multer-gridfs-storage"),
    Grid = require("gridfs-stream"), 
    Plant = require("./models/plant"),
    Comment=require("./models/comment"),
    User = require("./models/user.js"),
    
    middleware = require("./middleware");
    seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    plantRoutes = require("./routes/plants"),
    indexRoutes = require("./routes/index"),
    imageRouter = require("./routes/plantPost"),
    aboutRoutes = require("./routes/aboutus");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use( express.static( "public" ) );
app.set("view engine","ejs");
app.use(methodOverride("_method"));
require('dotenv').config();

let gfs;

const uri = process.env.MONGO_URL;
const connect = mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
connect.then(() => {
    console.log('Connected to database');
}, (err) => console.log(err));

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

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({storage});

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/', imageRouter(upload));
app.use("/",indexRoutes);
app.use("/", aboutRoutes);
app.use("/plants",plantRoutes);
app.use("/plants/:id/comments",commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports= app;