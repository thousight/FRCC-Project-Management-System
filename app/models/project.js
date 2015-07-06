var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema ({
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Project', ProjectSchema);
