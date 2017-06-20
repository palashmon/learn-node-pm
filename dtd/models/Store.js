const mongoose = require('mongoose');
const slug = require('slugs');
mongoose.Promise = global.Promise;


// More info on schema: http://mongoosejs.com/docs/guide.html
const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a store name!'
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tags: [String]
});

// More info on mongoose middleware: http://mongoosejs.com/docs/middleware.html
// Model#save here: http://mongoosejs.com/docs/api.html#model_Model-save
storeSchema.pre('save', function(next){
	if(!this.isModified('name')){
		next();	// skip it
		return; // stop this function from running further
	}
	this.slug = slug(this.name);
});

module.exports = mongoose.model('Store', storeSchema);