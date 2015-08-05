var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema ({
  creatorID: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: String, ref: 'User' },
  creator_dept: { type: String, ref: 'User' },
  title: String,
  short_description: String,
  description: String,
  priority: String,
  status: String,
  assign_dept: String,
  estimate_cost: Number,
  actual_cost: Number,
  last_modified_date: Date,
  due_date: Date,
  start_date: Date,
  complete_date: String,
  dateCreated: Date
});

module.exports = mongoose.model('Project', ProjectSchema);
