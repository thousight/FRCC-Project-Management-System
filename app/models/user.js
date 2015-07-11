var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema ({

  frcc_member_id: {
    type: String,
    requied: true
  },

  username: {
    type: String,
    requied: true,
    index: {
      unique: true
    }
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  cname: {
    type: String,
    requied: false
  },

  firstname: {
    type: String,
    requied: true
  },

  lastname: {
    type: String,
    requied: true
  },

  contact_phone: {
    type: String,
    requied: true
  },

  cell_phone: {
    type: String,
    requied: false
  },

  email: {
    type: String,
    requied: false
  },

  street: {
    type: String,
    requied: false
  },

  city: {
    type: String,
    requied: false
  },

  state: {
    type: String,
    requied: false
  },

  zip: {
    type: String,
    requied: false
  },

  country: {
    type: String,
    requied: false
  },

  isMale: {
    type: Number,
    requied: false
  },

  status: {
    type: Number,
    requied: false
  },

  selected: {
    type: Number,
    requied: false
  },

  frcc_member: {
    type: Number,
    requied: false
  },

  frcc_family_id: {
    type: String,
    requied: false
  },

  family_relation: {
    type: Number,
    requied: false
  },

  marital_status: {
    type: String,
    requied: false
  },

  main_language: {
    type: Number,
    requied: false
  },

  christian: {
    type: Number,
    requied: false
  },

  primary_group: {
    type: String,
    requied: false
  },

  frcc_familyserve: {
    type: String,
    requied: false
  },

  zone_leader_id: {
    type: Number,
    requied: false
  },

  groups: {
    type: Number,
    requied: false
  },

  dob: {
    type: String,
    requied: false
  },

  first_sunday: {
    type: String,
    requied: false
  },

  salvation: {
    type: String,
    requied: false
  },

  baptize: {
    type: String,
    requied: false
  },

  discount_code: {
    type: String,
    requied: false
  },

  frtc_teacher: {
    type: Number,
    requied: false
  },

  frtc_registered: {
    type: Number,
    requied: false
  },

  frtc_eschool: {
    type: String,
    requied: false
  },

  frtc_equipping: {
    type: String,
    requied: false
  },

  pm_role: {
    type: String,
    requied: false
  },

  created_date: {
    type: String,
    requied: false
  },

  update_date: {
    type: String,
    requied: false
  },

  update_person: {
    type: String,
    requied: false
  },

  department: {
    type: String,
    required: false
  },

  division: {
    type: String,
    required: false
  },

  organization: {
    type: String,
    required: false
  }

});

UserSchema.pre('save', function(next) {

  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, null, null, function(err, hash) {

    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });

});

UserSchema.methods.comparePassword = function(password) {

  var user = this;

  return bcrypt.compareSync(password, user.password);

}

module.exports = mongoose.model('User', UserSchema);
