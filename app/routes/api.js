var User = require('../models/user');
var Project = require('../models/project');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var fields = 'frcc_member_id username password cname firstname lastname contact_phone cell_phone email street city state zip country isMale status selected frcc_member frcc_family_id family_relation marital_status main_language christian primary_group frcc_familyserve zone_leader_id groups dob first_sunday salvation baptize discount_code frtc_teacher frtc_registered frtc_eschool frtc_equipping pm_role created_date update_date update_person department division organization';

// Create tokens for users with jsonwebtoken
function createToken(user) {
  var token = jsonwebtoken.sign({
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username
  }, secretKey, {
    expirtesInMinute: 1440
  });
  return token;
}

module.exports = function(app, express, io) {
  var api = express.Router();

  api.get('/all_projects', function(req, res) {
    Project.find({}, function(err, projects) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(projects);
    })
  })

  // login api
  api.post('/login', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select(fields).exec(function(err, user) {
      if(err) {
        throw err;
      }
      if (!user) {
        res.send({ message: "User doesn't exist"});
      } else if(user){
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.send({ message: "Invalid Password"});
        } else {
          var token = createToken(user);
          res.json({
            success: true,
            message: "Login Successfully !",
            token: token
          });
        }
      }
    });
  });

  //middleware
  api.use(function(req, res, next) {
    console.log("Somebody just logged in!");
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
      jsonwebtoken.verify(token, secretKey, function(err, decoded) {
        if (err) {
          res.status(403).send({success: false, message: "Failed to authenticate user."});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({ success: false, message: "No Token Provided." });
    }
  });

//api for projects handling
  api.route('/')
    .post(function(req, res) {
      var status = function(start_date, due_date)　{
        var now = Date.now();
        if (now >= start_date && due_date > start_date) {
          return "In progress";
        }
        else if (now >= due_date) {
          return "Finished";
        }
        else {
          return "Not yet started";
        }
      }
      var project = new Project({
        creatorID: req.decoded.id,
        creator: req.decoded.firstname + " " + req.decoded.lastname,
        creator_dept: req.decoded.department,
        title: req.body.title,
        short_description: req.body.short_description,
        description: req.body.description,
        priority: req.body.priority,
        status: status(req.body.start_date, req.body.due_date),
        assign_dept: req.body.assign_dept,
        estimate_cost: req.body.estimate_cost,
        actual_cost: req.body.actual_cost,
        due_date: req.body.due_date,
        start_date: req.body.start_date,
        complete_date: req.body.complete_date,
        complete_pct: req.body.complete_pct,
      });
      project.save(function(err, newProject) {
        if (err) {
          res.send(err);
          return;
        }
        io.emit('project', newProject);
        res.json({
          message: "New Project Created!"
        });
      });
    })
    .get(function(req, res) {
      Project.find( {creatorID: req.decoded.id}, function(err, project) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(project);
      });
    });
  // api for angular
  api.get('/me', function(req, res) {
    res.json(req.decoded);
  });

  return api;
}
