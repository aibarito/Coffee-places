var express = require("express")
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Caffee = require("./models/caffees.js")
var Seed = require("./seed")
var Comment = require("./models/comments")
var passport = require("passport")
var passportLocal = require("passport-local")
var User = require("./models/user")
var caffeeRoute = require("./routes/caffee")
var indexRoute = require("./routes/index")
var commentRoute = require("./routes/comments")
var methodOverride = require("method-override")
var flash = require("connect-flash")

// Seed();
mongoose.set('useCreateIndex', true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost/caffees", { useNewUrlParser: true });


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/style"))
app.locals.moment = require("moment")
app.use(require("express-session")({
	secret: "aibar",
	resave: false,
	saveUninitialized: false
}))
app.use(flash()) //here
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next();
})


passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use("/caffees", caffeeRoute)
app.use(indexRoute)
app.use("/caffees/:id", commentRoute)


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Started");
})