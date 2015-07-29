var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowupSchema = new Schema ({
  creatorID: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: String, ref: 'User' },
  followupTaskID: Schema.Types.ObjectId,
  title: String,
  description: String,
  last_modified_date: Date,
  dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Followup', FollowupSchema);
