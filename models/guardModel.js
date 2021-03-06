const mongoose = require("mongoose");
const slugify = require("slugify");
// const Zone = require("./zoneModel");
// const validator = require("validator") install first

//todo =>
// Type of Ids, banks account and branch,reprimands,guarantors and details, employment history,
// reviews, scanned application,

// Opt for parent referencing if you dont know
// how much your arrays will grow

// create resource schema
const guardsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A guard name is required"],
      trim: true,
      unique: true, // helps to avoid duplication of field name
      maxlength: [60, "A guard name must be less than 60 characters"],
      minlength: [5, "A guard name must be more than 5 characters"],
      //for numbers and dates, we have min and max
      // validate: [validator.isAlpha, "name must contain only letters"] // install first
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is require"],
      enum: {
        // options are restricted to the 3 values, available only on strings
        values: ["Male", "Female, Other"],
        message: "Gender is either Male, Female or Other",
      },
    },

    // child referencing supervisors in guard model
    // supervisors: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    // },
    zone: {
      type: mongoose.Schema.ObjectId,
      ref: "Zone",
    },

    // embedded zone here check document middleware below
    // zones: Array,

    // referencing location model here
    locations: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Location",
      },
    ],

    title: String,
    slug: String,
    shift: {
      type: String,
      required: [true, "Shift is required"],
      enum: {
        values: ["Day", "Night"],
        message: "Shift is either Day or Night",
      },
    },
    passportPicture: {
      type: String,
      required: [true, "Passport picture is required"],
    },
    // vipGuard: {
    //   type: Boolean,
    //   default: false
    // },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    // set virtuals to true on json and object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/**
 * use regular functions in models in mongoose
 * because arrow functions dont get their own "this" but "this" of parent.
 * the "this" key in model points to the current document
 */

// virtuals => fields that are defined on the schema but it not persisted or save to the DB
// virtual properties will show in the output
guardsSchema.virtual("age").get(function () {
  return Date.now() - this.dateOfBirth;
});

/**
 * mongoose middleware => code that run before or after each action
 * eg. document(act on currently processed document), query, aggregate
 * and model middlewares.
 * mongoose middleware also have the next() function to call
 * the next middlewares in the middleware stack
 */

/** DOCUMENT MIDDLEWARE
 * eg. of document middleware that runs before (pre) an event(save() & create())
 *  the "this" in a document middleware keyword points to the currently processed document
 * */
guardsSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// adding populate here will replace zones id with actual data (referencing ** child)
// -select will also remove items from the response
guardsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "locations",
    select: "-__v",
  }).populate({
    path: "zone",
  });

  next();
});

/** This was removed in place child referencing because
 *  Embedding Zones in Guards Model
 * of the draw backs 0f embedding in this case esp. updating
 * This will get the zones documents from the zones id provided
 */
// guardsSchema.pre("save", async function (next) {
//   const zonesPromises = this.zones.map(
//     async (zoneId) => await Zone.findById(zoneId)
//   );

//   this.zones = await Promise.all(zonesPromises);

//   next();
// });

/**
 * post middleware has access to the just save document (doc)
 * and are executed after all the pre middlewares are executed
 */

// guardsSchema.post("save", function(doc, next) {
//   console.log(doc)
//   next()
// });

/** QUERY MIDDLEWARE
 * Query middlewares allow us to run functions before or after
 * a certain query(find, findOne) is executed. The "this" keyword here points
 * to the current query.
 */

// this will not show vipGuards when find is executed
// /^find/ look for every query that starts with find (regexp)
// guardsSchema.pre("/^find/", function(next) {
//   this.find({ vipGuard: { $ne: true } });
//   next();
// });

// post query middleware
// guardsSchema.post("/^find/", function(){
//   //do something here
//   next()
// })

/** AGGREGATION MIDDLEWARE
 * allow you to do stuff before and after an aggregation
 */

//  guardsSchema.pre("aggregate", function(next){
//    // do something here
// this.pipeline().unshift({ $match: { vipGuard: { $ne: true } } });
//    next()
//  })

// create resource(Guard) model from schema
const Guards = mongoose.model("Guards", guardsSchema);

module.exports = Guards;
