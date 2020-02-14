var Caffee= require("../models/caffees")
var Comment = require("../models/comments")
var middlewareObj = {};

middlewareObj.isSameUserComment = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, thecomment){
			if(req.user.id == thecomment.author.id){
				return next();
			}	
			else{
				req.flash("You do not have permission to do it \n It is created by" + thecomment.author.name )
				res.redirect("/login")
			}
		})
	}
	else{
		req.flash("Log in first")
		res.redirect("/login")
	}
}
middlewareObj.isLogged = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "Log in to do that")
		res.redirect("/login")
	}
}
middlewareObj.isSameUserCaffee = function(req, res, next){
	if(req.isAuthenticated()){
		Caffee.findById(req.params.id, function(err, thecaffee){
			if(req.user.id == thecaffee.author.id){
				return next();
			}	
			else{
				req.flash("error", "You do not have permission to do it \n It is created by" + thecaffee.author.username)
				res.redirect("/login")
			}
		})
	}
	else{
		console.log("sign in first")
		req.flash("error", "Log in first")
		res.redirect("/login")
	}
}


module.exports = middlewareObj;