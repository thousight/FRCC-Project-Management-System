var User = require('../models/user');
var Project = require('../models/project');
var Task = require('../models/task');
var Followup = require('../models/followup');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var fields = 'frcc_member_id username password firstname lastname department cname contact_phone cell_phone email street city state zip country isMale status selected frcc_member frcc_family_id family_relation marital_status main_language christian primary_group frcc_familyserve zone_leader_id groups dob first_sunday salvation baptize discount_code frtc_teacher frtc_registered frtc_eschool frtc_equipping pm_role created_date update_date update_person division organization';

// Create tokens for users with jsonwebtoken
function createToken(user) {
  var token = jsonwebtoken.sign({
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    department: user.department
  }, secretKey, {
    expirtesInMinute: 1440
  });
  return token;
}

module.exports = function(app, express, io) {
  var api = express.Router();

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
            message: "Login Successfully!",
            token: token
          });
        }
      }
    });
  });

  // middleware for verifying token
  api.use(function(req, res, next) {
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


  // Project

  // All Projects api
  api.get('/all_projects', function(req, res) {
    Project.find({}, function(err, projects) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(projects);
    })
  })

  // api for projects creation and retrieval
  api.route('/projects')
  .post(function(req, res) {
    // Compare dates to get status
    var calcStatus = function()　{
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var start_obj = new Date(req.body.start_date);
      var due_obj = new Date(req.body.due_date);
      var today = today_obj.getTime();
      var start = start_obj.getTime();
      var due = due_obj.getTime();
      // Now is before project start date
      if (today < start) {
        return "Not started";
      }
      // Today is project start date and it's not an one-day event
      else if (today == start && start != due) {
        return "Starts today";
      }
      // Today is project due date or it's an one-day event
      else if (today == due || start == due) {
        return "Due today";
      }
      // Now is in project date range
      else if (today > start && today < due && start != due) {
        return "In progress";
      }
      // Anything else
      else {
        return "Passed due";
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
      status: calcStatus(),
      assign_dept: req.body.assign_dept,
      estimate_cost: req.body.estimate_cost,
      actual_cost: req.body.actual_cost,
      last_modified_date: Date.now(),
      due_date: req.body.due_date,
      start_date: req.body.start_date,
      complete_date: "Incomplete",
      dateCreated: Date.now()
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

  // deleteProject api
  api.post('/deleteProject', function(req, res) {
    Project.remove({ _id: req.body.id }, function(err) {
      if (err){
        res.send(err);
        return;
      }
    });
  })

  // updateProject api
  api.post('/updateProject', function(req, res) {
    var calcStatus = function()　{
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var start_obj = new Date(req.body.start_date);
      var due_obj = new Date(req.body.due_date);
      var today = today_obj.getTime();
      var start = start_obj.getTime();
      var due = due_obj.getTime();
      // Now is before project start date
      if (today < start) {
        return "Not started";
      }
      // Today is project start date and it's not an one-day event
      else if (today == start && start != due) {
        return "Starts today";
      }
      // Today is project due date or it's an one-day event
      else if (today == due || start == due) {
        return "Due today";
      }
      // Now is in project date range
      else if (today > start && today < due && start != due) {
        return "In progress";
      }
      // Anything else
      else {
        return "Passed due";
      }
    }
    var update = {
      title: req.body.title,
      short_description: req.body.short_description,
      description: req.body.description,
      priority: req.body.priority,
      status: calcStatus(),
      assign_dept: req.body.assign_dept,
      last_modified_date: Date.now(),
      due_date: req.body.due_date,
      start_date: req.body.start_date
    };
    Project.update( {_id: req.body._id}, { $set: update }, function (err, project) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(project);
    })
  })

  // completeProject api
  api.post('/completeProject', function(req, res) {
    Project.findByIdAndUpdate(req.body._id, { $set: {complete_date: req.body.complete_date} }, function (err, project) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(project);
    })
  })

  // status api for real time update
  api.get('/projectStatus', function(req, res) {
    var calcStatus = function(eachProject)　{
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var start_obj = new Date(eachProject.start_date);
      var due_obj = new Date(eachProject.due_date);
      var today = today_obj.getTime();
      var start = start_obj.getTime();
      var due = due_obj.getTime();
      // Now is before project start date
      if (today < start) {
        return "Not started";
      }
      // Today is project start date and it's not an one-day event
      else if (today == start && start != due) {
        return "Starts today";
      }
      // Today is project due date or it's an one-day event
      else if (today == due || start == due) {
        return "Due today";
      }
      // Now is in project date range
      else if (today > start && today < due && start != due) {
        return "In progress";
      }
      // Anything else
      else {
        return "Passed due";
      }
    }
    Project.find( {creatorID: req.decoded.id}, function(err, project) {
      if (err) {
        res.send(err);
        return;
      }
      for (var i = 0; i < project.length; i++) {
        var eachProject = project[i];
        var statusName = "status" + eachProject._id;
        io.emit(statusName, {'status': calcStatus(eachProject)});
      }
    });
  })


  // Task

  // All Tasks api
  api.get('/all_tasks', function(req, res) {
    Task.find({}, function(err, tasks) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(tasks);
    })
  })

  // api for tasks creation and retrieval
  api.route('/tasks')
  .post(function(req, res) {
    // Compare dates to get status
    var calcStatus = function()　{
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var start_obj = new Date(req.body.taskStart_date);
      var due_obj = new Date(req.body.taskDue_date);
      var today = today_obj.getTime();
      var start = start_obj.getTime();
      var due = due_obj.getTime();
      // Now is before task start date
      if (today < start) {
        return "Not started";
      }
      // Today is task start date and it's not an one-day event
      else if (today == start && start != due) {
        return "Starts today";
      }
      // Today is task due date or it's an one-day event
      else if (today == due || start == due) {
        return "Due today";
      }
      // Now is in task date range
      else if (today > start && today < due && start != due) {
        return "In progress";
      }
      // Anything else
      else {
        return "Passed due";
      }
    }
    var task = new Task({
      creatorID: req.decoded.id,
      creator: req.decoded.firstname + " " + req.decoded.lastname,
      taskProjectID: req.body.taskProjectID,
      title: req.body.taskTitle,
      description: req.body.taskDescription,
      status: calcStatus(),
      assigneeName: req.body.assigneeName,
      assigneeID: req.body.assigneeID,
      assignee_dept: req.body.assignee_dept,
      estimate_cost: req.body.taskEstimate_cost,
      actual_cost: req.body.TaskActual_cost,
      last_modified_date: Date.now(),
      due_date: req.body.taskDue_date,
      start_date: req.body.taskStart_date,
      dateCreated: Date.now(),
      complete_date: "Incomplete",
    });
    task.save(function(err, newTask) {
      if (err) {
        res.send(err);
        return;
      }
      io.emit('task', newTask);
      res.json({
        message: "New Task Created!"
      });
    });
  })
  .get(function(req, res) {
    Task.find( {creatorID: req.decoded.id}, function(err, task) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(task);
    });
  });

  // deleteAllTask api
  api.post('/deleteAllTasks', function(req, res) {
    Task.remove({ taskProjectID: req.body.projectID }, function(err) {
      if (err) {
        res.send(err);
        return;
      }
    });
  })

  // deleteOneTask api
  api.post('/deleteOneTask', function(req, res) {
    Task.remove({ _id: req.body.id }, function(err) {
      if (err) {
        res.send(err);
        return;
      }
    });
  })

  // completeTask api
  api.post('/completeTask', function(req, res) {
    Task.findByIdAndUpdate(req.body.id, { $set: {complete_date: req.body.complete_date} }, function (err, task) {
      if (err) {
        res.send(err);
        return;
      }
    })
  })

  // countTotalTask api
  api.post('/countTotalTask', function(req, res) {
    Task.count({taskProjectID: req.body.id}, function(err, count) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(count);
    })
  })

  // countCompletedTask api
  api.post('/countCompletedTask', function(req, res) {
    Task.count({$and: [{taskProjectID: req.body.id}, {complete_date: {$ne: "Incomplete"}}]}, function(err, count) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(count);
    })
  })

  // updateTask api
  api.post('/updateTask', function(req, res) {
    var calcStatus = function()　{
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var start_obj = new Date(req.body.start_date);
      var due_obj = new Date(req.body.due_date);
      var today = today_obj.getTime();
      var start = start_obj.getTime();
      var due = due_obj.getTime();
      // Now is before project start date
      if (today < start) {
        return "Not started";
      }
      // Today is project start date and it's not an one-day event
      else if (today == start && start != due) {
        return "Starts today";
      }
      // Today is project due date or it's an one-day event
      else if (today == due || start == due) {
        return "Due today";
      }
      // Now is in project date range
      else if (today > start && today < due && start != due) {
        return "In progress";
      }
      // Anything else
      else {
        return "Passed due";
      }
    }
    var update = {
      title: req.body.title,
      description: req.body.description,
      assigneeName: req.body.assigneeName,
      assignee_dept: req.body.assignee_dept,
      status: calcStatus(),
      actual_cost: req.body.actual_cost,
      last_modified_date: Date.now(),
      due_date: req.body.due_date,
      start_date: req.body.start_date
    };
    Task.update( {_id: req.body._id}, { $set: update }, function (err, task) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(task);
    })
  })

  // Followup

  // All Followup api
  api.get('/all_followups', function(req, res) {
    Followup.find({}, function(err, followups) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(followups);
    })
  })

  // api for followups creation and retrieval
  api.route('/followups')
  .post(function(req, res) {
    var followup = new Followup({
      creatorID: req.decoded.id,
      creator: req.decoded.firstname + " " + req.decoded.lastname,
      followupTaskID: req.body.followupTaskID,
      title: req.body.followupTitle,
      description: req.body.followupDescription,
      last_modified_date: Date.now(),
      dateCreated: Date.now(),
      complete_date: "Incomplete"
    });
    followup.save(function(err, newFollowup) {
      if (err) {
        res.send(err);
        return;
      }
      io.emit('followup', newFollowup);
      res.json({
        message: "New Followup Created!"
      });
    });
  })
  .get(function(req, res) {
    Followup.find( {creatorID: req.decoded.id}, function(err, followup) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(followup);
    });
  });

  // deleteAllFollowups api
  api.post('/deleteAllFollowups', function(req, res) {
    Followup.remove({ followupTaskID: req.body.taskID }, function(err) {
      if (err) {
        res.send(err);
        return;
      }
    });
  })

  // deleteOneFollowup api
  api.post('/deleteOneFollowup', function(req, res) {
    Followup.remove({ _id: req.body.id }, function(err) {
      if (err) {
        res.send(err);
        return;
      }
    });
  })

  // completeFollowup api
  api.post('/completeFollowup', function(req, res) {
    Followup.findByIdAndUpdate(req.body.id, { $set: {complete_date: req.body.complete_date} }, function (err, followup) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(followup);
    })
  })

  // updateFollowup api
  api.post('/updateFollowup', function(req, res) {
    var calcStatus = function()　{
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var start_obj = new Date(req.body.start_date);
      var due_obj = new Date(req.body.due_date);
      var today = today_obj.getTime();
      var start = start_obj.getTime();
      var due = due_obj.getTime();
      // Now is before project start date
      if (today < start) {
        return "Not started";
      }
      // Today is project start date and it's not an one-day event
      else if (today == start && start != due) {
        return "Starts today";
      }
      // Today is project due date or it's an one-day event
      else if (today == due || start == due) {
        return "Due today";
      }
      // Now is in project date range
      else if (today > start && today < due && start != due) {
        return "In progress";
      }
      // Anything else
      else {
        return "Passed due";
      }
    }
    var update = {
      title: req.body.title,
      description: req.body.description,
      last_modified_date: Date.now()
    };
    Followup.update( {_id: req.body._id}, { $set: update }, function (err, followup) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(followup);
    })
  })

  // User

  // api for getUser
  api.get('/all_users', function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(users);
    })
  })

  // api for signup
  // Not gonna create a service for it, but have it for easier signup because password is encrypted in database
  // To create a user, just POST the fields and correlated records to Postman(a chrome app, may use something similar) to IP/api/signup
  api.post('/signup', function(req, res) {
    var user = new User({
      frcc_member_id: req.body.frcc_member_id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      department: req.body.department,
      cname: req.body.cname,
      contact_phone: req.body.contact_phone,
      cell_phone: req.body.cell_phone,
      email: req.body.email,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      isMale: req.body.isMale,
      status: req.body.status,
      selected: req.body.selected,
      frcc_member: req.body.frcc_member,
      frcc_family_id: req.body.frcc_family_id,
      family_relation: req.body.family_relation,
      marital_status: req.body.marital_status,
      main_language: req.body.main_language,
      christian: req.body.christian,
      primary_group: req.body.primary_group,
      frcc_familyserve: req.body.frcc_familyserve,
      zone_leader_id: req.body.zone_leader_id,
      groups: req.body.groups,
      dob: req.body.dob,
      first_sunday: req.body.first_sunday,
      salvation: req.body.salvation,
      baptize: req.body.baptize,
      discount_code: req.body.discount_code,
      frtc_teacher: req.body.frtc_teacher,
      frtc_registered: req.body.frtc_registered,
      frtc_eschool: req.body.frtc_eschool,
      frtc_equipping: req.body.frtc_equipping,
      pm_role: req.body.pm_role,
      created_date: req.body.created_date,
      update_date: req.body.update_date,
      update_person: req.body.update_person,
      division: req.body.division,
      organization: req.body.organization
    });
    var token = createToken(user);
    user.save(function(err) {
      if (err) {
        res.send(err);
        return;
      }
      res.json({
        success: true,
        message: 'User has been created!',
        token: token
      });
    })
  })

  api.get('/me', function(req, res) {
    res.json(req.decoded);
  });

  return api;
}
