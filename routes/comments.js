var express = require("express")
var Caffee = require("../models/caffees") //here
var router = express.Router({mergeParams: true});
var Comment = require("../models/comments")
var middlewareObj = require("../middleware/middleware")



router.get("/comments/new", middlewareObj.isLogged, function(req, res){
	Caffee.findById(req.params.id, function(err, thecaffee){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments", {caffee: thecaffee});
		}
	});
	
})
router.post("/comments", function(req, res){
	var author = req.body.author;
	var text = req.body.text;
	Caffee.findById(req.params.id, function(err, thecaffee){
		if(!err){
			Comment.create({
				author: {id: req.user.id, name:req.user.username},
				text: text
			}, function(err, comment){
				if(!err){
					thecaffee.comments.push(comment)
					thecaffee.save();
					req.flash("success", "You successfully added a comment")
					res.redirect("/caffees/" + thecaffee.id)
				}
			})
		}
	});
})
router.get("/comments/:comment_id/edit", middlewareObj.isSameUserComment, function(req, res){
	Comment.findById(req.params.comment_id, function(err, thecomment){
		if(!err){
			Caffee.findById(req.params.id, function(err, thecaffee){
				if(!err){
					res.render("updatecomment", {thecomment: thecomment, 
												caffee: thecaffee})
				}
			})
			
		}
	})
	
})
router.put("/comments/:comment_id", middlewareObj.isSameUserComment, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, {text: req.body.text}, function(err, thecomment){
		if(!err){
			req.flash("You successfully updated a comment")
			res.redirect("/caffees/" + req.params.id)
		}
	})
})
router.delete("/comments/:comment_id", middlewareObj.isSameUserComment, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(!err){
			req.flash("success", "comment deleted")
			res.redirect("/caffees/" + req.params.id)
		}
	})
})

module.exports = router;