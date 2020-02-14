var express = require("express")
var router = express.Router();
var passport = require("passport")
var User = require("../models/user")
var Caffee = require("../models/caffees")
var Async = require("async")
var nodemailer = require("nodemailer")
var crypto = require("crypto")
require("dotenv").config()


router.get("/", function(req, res){
	res.render("landing");
})
router.get("/register", function(req, res){
	res.render("user/register", {page: "register"});
})
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username,
						   firstName: req.body.firstName,
						   lastName: req.body.lastName,
						   email: req.body.email,
						   avatar: req.body.avatar}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message)
			res.redirect("back")
			//res.redirect("/register")
		}
		else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success", "Welcome to Caffee's" + req.user.username)
				res.redirect("/caffees")
			})
		}
	})
})
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(!err){
			Caffee.find().where("author.id").equals(req.params.id).exec(function(err, thecaffees){
				if(err){
					console.log(err)
				}
				else{
					res.render("user/show", {user: foundUser, caffees: thecaffees});
				}
			})
		}
	})
})
router.get("/login", function(req,res){
	res.render("user/login", {page: "login"});
})
router.post("/login", passport.authenticate("local", {
	successRedirect: "/caffees",
	successFlash: "Welcome", 
	failureRedirect: "/login",
	failureFlash: "Invalid username or password. Try again! "
}), function(req, res){
	
})
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out")
	res.redirect("/caffees")
})
router.get("/forgot", function(req, res){
	res.render("user/forgot");
})
router.post("/forgot", function(req, res, next){
	Async.waterfall([
		function(done){
			crypto.randomBytes(20, function(err, buf){
				var token = buf.toString("hex");
				done(err, token);
			});
		},
		 function(token, done){
			 User.findOne({email: req.body.email}, function(err, user){
				 if(err){
					 console.log("err")
				 }
				 else{
					if(!user){
						req.flash('error', "No accound with given email is found");
						return res.redirect("/forgot")
					}
					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000;

					user.save(function(err){
						 done(err, token, user);
					});
				 }		 
			 })
		 },
			function(token, user, done){
				var smtpTransport = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: "zaibar.228@gmail.com",
						pass: process.env.GMAILPW
					}
				});
				var mailOptions = {
					to: user.email,
					from: "zaibar.228@gmail.com",
					subject: "Reset your password",
					text: "follow the given link \n https://myfirstcontainer-ozinu.run.goorm.io/reset/" + token + "\n honey"
				}
				smtpTransport.sendMail(mailOptions, function(err){
					console.log("send");
					req.flash("success", "Email was send to " + user.email);
					done(err, 'done');
				})
			}
		],function(err){
				if(err){
					console.log("err")
				 	return next(err);
				}
				res.redirect("/forgot")
			}
		
	)
})
router.get("/reset/:token", function(req, res){
	User.findOne({resetPasswordToken: req.params.token,
				 resetPasswordExpires: {$gt: Date.now()}}, function(err, foundUser){
		if(!foundUser){
			console.log("Password reset token is invalid or has expired ")
			req.flash("error", "Password reset token is invalid or has expired ")
			res.redirect("/forgot")
		}
		else{
			if(!err){
				res.render("user/reset", {token: req.params.token, user: foundUser})
			}	
		}
	})
})
router.post("/reset/:token", function(req, res){
	Async.waterfall([
		function(done){
			User.findOne({resetPasswordToken: req.params.token, 
						 resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
				console.log('3');
				if(err){
					req.flash('error', err)
					res.redirect('back')
				}
				else{
					console.log('1')
					if(req.body.newPassword == req.body.confirm){
						console.log('2')
						user.setPassword(req.body.newPassword, function(err){
							if(!err){
								user.resetPasswordToken = undefined;
								user.resetPasswordExpires = undefined;
								user.save(function(err){
									req.logIn(user, function(err){
										done(err, user);
									})
								})
							}
						})
					}
					else{
						req.flash('error', "Passwords do not match");
						res.redirect('back');
					}
				}
			})
		},
		function(err){
			req.flash("success", "Password for " + req.user.username+  " was successfully updated")
			res.redirect("/caffees");
		}
	])
})


module.exports = router;