'use strict';

// A relational database sequence is a database product that creates unique values by getting
// an auto increment with a value which could be of a step of 1, 2, and so on.
// This model attempts to recreate this feature in MongoDb.

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var sequenceCounterSchema = new Schema({
  seq: {
    type: Number
  }
}, {
  strict: false //set to strict to allow  override
});

//  Increment the value of the sequence_value field of the counter collection
sequenceCounterSchema.statics.getValueForNextSequence = function (sequenceOfName, callback) {
  this.collection.findOneAndUpdate({
    _id: sequenceOfName
  }, {
    $inc: {
      seq: 1
    }
  }, {
    upsert: true,
    returnOriginal: false
  }, (err, doc) => {
    if (err || !doc.value) {
      return callback(err);
    }

    callback(null, doc.value.seq);
  });
};

mongoose.model('SequenceCounter', sequenceCounterSchema);
