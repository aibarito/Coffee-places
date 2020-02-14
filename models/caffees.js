var mongoose = require("mongoose")

var caffeeSchema = new mongoose.Schema({
	name: String,
	price: Number,
	createdAt: {type: Date, default: Date.now},
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	location: String,
	bestcoffee:{
		image: String,
		name: String
	}
})

module.exports= mongoose.model("Caffee", caffeeSchema);
