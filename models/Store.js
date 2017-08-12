const mongoose = require('mongoose');
const slug = require('slugs');
mongoose.Promise = global.Promise;

// More info on schema: http://mongoosejs.com/docs/guide.html
const storeSchema = new mongoose.Schema(
  {
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
      coordinates: [
        {
          type: Number,
          required: 'You must supply coordinates!'
        }
      ],
      address: {
        type: String,
        required: 'You must supply an address!'
      }
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'You must supply an author'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Define our indexes
storeSchema.index({
  name: 'text',
  description: 'text'
});

// Index the location column as 2dsphere for faster processing
// Info: https://docs.mongodb.com/v3.2/core/2dsphere/
storeSchema.index({ location: '2dsphere' });

// More info on mongoose middleware: http://mongoosejs.com/docs/middleware.html
// Model#save here: http://mongoosejs.com/docs/api.html#model_Model-save
storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
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
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO make more resilient so slugs are unique
});

// mongodb aggregation using Pipeline Operators
// More info: https://docs.mongodb.com/manual/reference/operator/aggregation/
/*
	1. Unwind store for each tag
	2. Group by tags field
	3. This creates a new object for each tag like { _id: 'tagname', count: <number of stores for each tag>}
	4. Finally sort by count descending direction
	5. $sort key ordering must be 1 (for ascending) or -1 (for descending)
*/
storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    {
      $unwind: '$tags'
    }, // https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#pipe._S_unwind
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// find reviews where the stores _id property === reviews store property
storeSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'store' // which field on the review?
});

/**
 * DB query to get top rated stores
 */
storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    // Lookup Stores and populate their reviews
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'store',
        as: 'reviews'
      }
    },

    // filter for only items that have 2 or more reviews
    {
      $match: { 'reviews.1': { $exists: true } }
    },

    // Add the average reviews field
    {
      $project: {
        photo: '$$ROOT.photo',
        name: '$$ROOT.name',
        reviews: '$$ROOT.reviews',
        slug: '$$ROOT.slug',
        averageRating: { $avg: '$reviews.rating' }
      }
    },

    // sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 } },

    // limit to at most 10
    { $limit: 10 }
  ]);
};

function autopopulate(next) {
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);
