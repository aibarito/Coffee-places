var express = require("express")
var Caffee = require("../models/caffees") //here
var router = express.Router()
var Comment = require("../models/comments")
var middlewareObj = require("../middleware/middleware")

router.get("/", function(req, res){
	var noMatch = "";
	var valueOfSearch = "";
	if(req.query.search){
		var valueOfSearch = req.query.search
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Caffee.find({name: regex}, function(err, allcaffees){
			if(!err){
				if(allcaffees.length == 0){
					var noMatch = "No caffee with given name is found, please try again"
				}
				console.log(noMatch)
				console.log(allcaffees)
				res.render("caffees", {caffees: allcaffees, noMatch: noMatch, page: "caffees", valueOfSearch: valueOfSearch})
				
			}
		})
	}else{
		Caffee.find({}, function(err, allcaffees){
			if(err)
				console.log("An error")
			else{
				res.render("caffees", {caffees: allcaffees, page: "caffees", noMatch: noMatch, valueOfSearch: valueOfSearch})

			}
		})		
	}
})

router.get("/new", middlewareObj.isLogged, function(req, res){
	res.render("form");
})
router.post("/", middlewareObj.isLogged, function(req, res){
	Caffee.create(
		{name: req.body.name, 
		 price: req.body.price,
		 image: req.body.image,
		 description: req.body.description,
		 author: {
			 id: req.user.id,
			 username: req.user.username
		 },
		 location: req.body.location
		}, function(err, newcaffee){
			if(err)
				console.log("ERr")
			else{
				req.flash("success", "You created a caffee!")
				res.redirect("/caffees");
			}
		})
	
})
router.get("/:id/edit", middlewareObj.isSameUserCaffee, function(req ,res){
	Caffee.findById(req.params.id, function(err, thecaffee){
		if(!err){
			res.render("edit", {thecaffee: thecaffee});
		}
	})
	
})
router.get("/:id", function(req, res){
	Caffee.findById(req.params.id).populate("comments").exec(function(err, thecaffee){
		if(err){
			console.log("the err")
			console.log(err)
		}
		else{
			res.render("show", {caffee: thecaffee})
		}
	})

})
router.put("/:id", middlewareObj.isSameUserCaffee, function(req, res){
	Caffee.findByIdAndUpdate(req.params.id, req.body.caffee, function(err, updated){
		if(!err){
			req.flash("success", "Caffee updated")
			res.redirect("/caffees")
		}
	})
})
router.delete("/:id", middlewareObj.isSameUserCaffee, function(req, res){
	Caffee.findById(req.params.id, function(err, thecaffee){
		if(!err){
			thecaffee.comments.forEach(function(commentid){
				Comment.findByIdAndRemove(commentid, function(err){
					if(!err){
						console.log("one comment removed")
					}
				})
			})
		}
	})
	Caffee.findByIdAndRemove(req.params.id, function(err){
		if(!err){
			req.flash("success","The caffee and all associated comments are removed")
			res.redirect("/caffees")
		}
	})
})



router.post("/:id/suggested",middlewareObj.isSameUserCaffee, function(req, res){
	Caffee.findById(req.params.id, function(err, caffee){
		if(!err){
			if(req.body.coffeeImage){
				caffee.bestcoffee.image = req.body.coffeeImage
			}
			if(req.body.coffeeName){
				caffee.bestcoffee.name = req.body.coffeeName
			}
			caffee.save();
			res.redirect("/caffees/"+req.params.id)
		}
	})
})
router.post("/:id/changecoffee",middlewareObj.isSameUserCaffee, function(req, res){
	Caffee.findById(req.params.id, function(err, caffee){
		if(!err){
			caffee.bestcoffee.image = undefined;
			caffee.bestcoffee.name = undefined;
			caffee.save();
			res.redirect("/caffees/" + req.params.id)
		}
	})
})
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;