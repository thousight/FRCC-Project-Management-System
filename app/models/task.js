var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema ({
  creatorID: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: String, ref: 'User' },
  taskProjectID: Schema.Types.ObjectId,
  title: String,
  description: String,
  status: String,
  assigneeName: String,
  assigneeID: String,
  assignee_dept: String,
  estimate_cost: Number,
  actual_cost: Number,
  last_modified_date: Date,
  due_date: Date,
  start_date: Date,
  complete_date: {type: String, default: "Incomplete"},
  dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', TaskSchema);
