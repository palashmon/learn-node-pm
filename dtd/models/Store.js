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
	tags: [String],
	created: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [{
			type: Number,
			required: 'You must supply coordinates!'
		}],
		address: {
			type: String,
			required: 'You must supply an address!'
		}
	},
  	photo: String
});

// More info on mongoose middleware: http://mongoosejs.com/docs/middleware.html
// Model#save here: http://mongoosejs.com/docs/api.html#model_Model-save
storeSchema.pre('save', async function(next){
	if(!this.isModified('name')){
		next();	// skip it
		return; // stop this function from running further
	}
	this.slug = slug(this.name);
	
	// find other stores that have a slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');

	// Test cases
	/*
		slugRegEx.test('aaa');		// false
		slugRegEx.test('wes');		// true
		slugRegEx.test('wes-1');	// true
		slugRegEx.test('wes-199');	// true
	*/

	const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
	if(storesWithSlug.length) {
		this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
	}
	next();
	// TODO make more resiliant so slugs are unique
});

module.exports = mongoose.model('Store', storeSchema);