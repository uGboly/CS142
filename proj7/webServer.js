/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });// for parsing multipart/form-data
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');
const fs = require("fs");
var express = require('express');
var app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://127.0.0.1:27017/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });


// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            { name: 'user', collection: User },
            { name: 'photo', collection: Photo },
            { name: 'schemaInfo', collection: SchemaInfo }
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!request.session.loginUser) {
        response.status(401).send('The user is not logged in.');
        return;
    }

    //response.status(200).send(cs142models.userListModel());
    User.find({}, function (err, users) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (users.length === 0) {
            response.status(400).send("Found no user!");
            return;
        }
        let userList = users.map(user => {
            return {
                _id: user._id.valueOf(),
                first_name: user.first_name,
                last_name: user.last_name
            };
        });
        console.log('user list', userList);
        response.status(200).send(JSON.stringify(userList));
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!request.session.loginUser) {
        response.status(401).send('The user is not logged in.');
        return;
    }

    var id = request.params.id;
    User.findById(id, function (err, user) {
        if (err) {
            if (err.name === 'CastError') {
                response.status(400).send('something other than the id of a User is provided');
            } else {
                response.status(500).send(JSON.stringify(err));
            }
            return;
        }
        if (!user) {
            response.status(400).send('User with _id:' + id + ' not found.');
            return;
        }
        let userData = {
            _id: user._id.valueOf(),
            first_name: user.first_name,
            last_name: user.last_name,
            location: user.location,
            description: user.description,
            occupation: user.occupation
        };

        console.log('User with _id:' + id, userData);
        response.status(200).send(JSON.stringify(userData));
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!request.session.loginUser) {
        response.status(401).send('The user is not logged in.');
        return;
    }

    var id = request.params.id;
    Photo.find({ user_id: id }, function (err, photos) {
        if (err || photos.length === 0) {
            response.status(400).send('Photos for user with _id:' + id + ' not found.');
            return;
        }

        async.map(photos, function (photo, done_callback) {
            async.map(photo.comments, function (comment, done_callback1) {
                User.findById(comment.user_id, function (e, user) {
                    if (e) {
                        if (e.name === 'CastError') {
                            response.status(400).send('something other than the id of a User is provided');
                        } else {
                            response.status(500).send(JSON.stringify(e));
                        }
                        return;
                    }
                    if (!user) {
                        response.status(400).send('User with _id:' + comment.user_id + ' not found.');
                        return;
                    }
                    done_callback1(null, {
                        comment: comment.comment,
                        date_time: comment.date_time,
                        _id: comment._id,
                        user: { _id: user._id, first_name: user.first_name, last_name: user.last_name }
                    });
                });
            })
                .then(res => {
                    done_callback(null, {
                        _id: photo._id,
                        user_id: photo.user_id,
                        file_name: photo.file_name,
                        date_time: photo.date_time,
                        comments: res
                    });
                })
                .catch((error) => response.status(400).send(JSON.stringfy(error)));
        })
            .then(res => {
                console.log("photos", res);
                response.status(200).send(JSON.stringify(JSON.parse(JSON.stringify(res))));
            })
            .catch((error) => response.status(400).send(JSON.stringfy(error)));

    });

});

app.post('/admin/login', upload.any(), (req, res) => {
    let { login_name, password} = req.body;
    console.log(login_name + " ask to login.");


    User.find({ login_name, password : password }, function (err, user) {
        if (err || user.length === 0) {
            res.status(400).send('login_name is not a valid account');
            return;
        }

        req.session.loginUser = user[0]._id;

        let resData = {
            _id: user[0]._id,
            first_name: user[0].first_name
        };

        res.status(200).send(JSON.stringify(resData));
    });
});

app.post('/user', upload.any(), async (req, res) => {
    let { login_name, password, first_name, last_name, occupation, location, description} = req.body;
    console.log(login_name + " ask to register.");

    if (!login_name || !password || !first_name || !last_name) {
        res.status(400).send('login_name & password & first_name & last_name should be provided');
        return;
    }

    let duplicateUser = await User.findOne({login_name : login_name});
    if (duplicateUser) {
        res.status(400).send('Login name is used');
        return;
    }

    User.create({login_name, password, first_name, last_name, occupation, location, description}, (err) => {
        if (err) {
            res.status(400).send(JSON.stringify(err));
            return;
        }
        console.log('user created!');
        res.status(200).send('registration finished');
    });

});

app.post('/admin/logout', upload.any(), (req, res) => {
    if (!req.session.loginUser) {
        res.status(401).send('The user is not currently logged in.');
    } else {
        console.log(req.session.loginUser + "logout!");
        req.session.loginUser = '';
        res.status(200).send('The user logged out successfully!');
    }
});

app.post("/commentsOfPhoto/:photo_id", upload.any(), (req, res) => {
    if (!req.session.loginUser) {
        res.status(401).send('The user is not currently logged in.');
        return;
    }

    Photo.findById(req.params.photo_id, (err , photo) => {
        if(err) {
            res.status(404).send('Found no photo with this id');
            return;
        }

        Photo.findByIdAndUpdate(req.params.photo_id, {
                comments : [...photo.comments, {
                    comment: req.body.comment,
                    user_id: req.session.loginUser
                }]
            },
            e => {
                if (e) {
                    res.status(500).send(JSON.stringify(e));
                    return;
                }
                res.status(200).send('Successfully add comment');
            }
        );

    });
});

app.post('/photos/new', processFormBody, (req, res) => {
    if (!req.session.loginUser) {
        res.status(401).send('The user is not currently logged in.');
        return;
    }

    if (!req.file) {
        // XXX -  Insert error handling code here.
        res.status(500).send('recive no file');
        return;
    }

    const timestamp = new Date().valueOf();
    const filename = 'U' +  String(timestamp) + req.file.originalname;

    fs.writeFile("./images/" + filename, req.file.buffer, function (err) {
      // XXX - Once you have the file written into your images directory under the name
      // filename you can create the Photo object in the database
      console.log(err);
    });

    Photo.create({file_name : filename, user_id : req.session.loginUser}, (err) => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
            return;
        }
        console.log('Photo uploaded');
        res.status(200).send('Successfully upload photo');
    });
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});

