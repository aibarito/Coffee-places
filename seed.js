var mongoose = require("mongoose")
var Caffee = require("./models/caffees")
var Comment = require("./models/comments")

// var data = [
//     {
//         name: "Cloud's Rest", 
//         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Desert Mesa", 
//         image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Canyon Floor", 
//         image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     }
// ]
function Seed(){
	Comment.deleteMany({}, function(err){
		if(!err){
			console.log("comments are empty")
		}
	})
	Caffee.deleteMany({}, function(err){
		if(!err){
			console.log("all caffees deleted")
		}
	})
}
// 	})
// 	Campground.deleteMany({}, function(err){
// 		if(!err){
// 			console.log("everything is removed")
// 			data.forEach(function(seed){
// 				Campground.create(seed, function(err,thepost){
// 					if(err){
// 						console.log("err")
// 						console.log(err)
// 					}else{
// 						Comment.create({
// 							text: "hello",
// 							author: {name: "Arthur"}
// 						},function(err, thecomment){
// 							if(!err){
// 								thepost.comments.push(thecomment);
// 								thepost.save();
// 								console.log("comment added")
// 							}
// 						})
// 					}			
// 				});
// 			})
// 		}
// 	})
// }
module.exports = Seed;