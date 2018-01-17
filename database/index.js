var mysql = require('mysql');
var bcrypt = require('bcrypt');
var connection;
if (process.env.JAWSDB_URL){
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    // host: process.env.DBSERVER || 'localhost',
    // user: process.env.DBUSER || 'root',
    // password: process.env.DBPASSWORD || 'root',
    // database : process.env.DBNAME || 'fitbud',
    host: 'wftuqljwesiffol6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'eharucdcns5wg72u',
    password: 'b3pip6b93rwse6ku',
    database: 'fgj254pi7i31ksss',
  });
}

connection.connect(function(err){
	if (err) {
		console.log('could not connect to db', err);
	} else {
		console.log('connected to db');
	}
});

const defaultImg = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

var insertFBuser = function(userObj, cb) {
  var usrImgPath = '/' + defaultImg[Math.floor(Math.random() * defaultImg.length)];

  var query = 'INSERT INTO users (fb_id, name, email, photo) values (?, ?, ?, ?)';
  var values = [userObj.id, userObj.name, userObj.email, usrImgPath];
  connection.query(query, values,function(err, result){
    if (err) {
      console.log('error inserting FBuser',err);
    } else {
      cb(result);
    }
  });
}

var createUser = function(userObj) {
  var usrImgPath = '/' + defaultImg[Math.floor(Math.random() * defaultImg.length)];

	var query = 'INSERT INTO users (name, email, password, photo) values (?, ?, ?, ?)';
	bcrypt.genSalt(10, function(err, salt) {
		    bcrypt.hash(userObj.password, salt, function(err, hash) {
		        userObj.password = hash;
		        connection.query(query, [userObj.name, userObj.username, userObj.password, usrImgPath], function(err, result){
		        	if (err) {
		        		console.log('error inserting user', err);
		        	} else {
		        		console.log('successfully added');
		        	}
		        })
		    });
		});
}

var checkUser = function(username, callback) {
	var query = 'SELECT * from users WHERE email = ?';
	connection.query(query, [username], function(err, dbUserResult){
		if (err) {
			//console.log('error when finding user', err);
		} else{
			if (dbUserResult.length === 0) {
				callback(err, null);
			}
			else callback(null, dbUserResult);
		}
	})
}

var comparePassword = function(passwordEntered, hash, callback) {
	console.log('inside compare password');
	bcrypt.compare(passwordEntered, hash, function(err, isMatch){
		if (err) throw err;
		callback(null, isMatch)
	});

};

var findById = function(id, callback) {

	var query = 'SELECT * from users WHERE id = ?';
	connection.query(query, [id], function(err, dbResultArr){
		if (err) {
			console.log('error when finding id', err);
		} else {
			// console.log('result of finding a id', dbResultArr[0]);
      if (!dbResultArr[0].photo) {
        var usrImgPath = '/' + defaultImg[Math.floor(Math.random() * defaultImg.length)];
        dbResultArr[0].photo = usrImgPath;
      }
			callback(null, dbResultArr[0]);
		}
	})
}

var findMultiplyById = function(id, callback) {
	console.log('findMultiplyById:', id)
	id = id.length > 1 ? JSON.parse(id).join(',') : id;
	var query = "SELECT * from users WHERE id in (" + id + ");";
	connection.query(query, function(err, dbResultArr){
		if (err) {
			console.log('error when finding id', err);
		} else {
			console.log('result of finding multipul id', dbResultArr);
			callback(null, dbResultArr);
		}
	})
}

var findByFB = function(fb_id, callback) {

	var query = 'SELECT * from users WHERE fb_id=?';
	connection.query(query, [fb_id], function(err, dbResultArr){
		if (err) {
			console.log('error when finding ');
		} else {
			console.log('result of finding a id by FB', dbResultArr[0]);
			callback(null, dbResultArr[0]);
		}
	})
}

var getWorkouts = function(id, callback) {
	var query = 'SELECT posting.*, requests.status, (posting.buddies - 1) AS modified_buddies \
               FROM (SELECT users.name, users.id as ownerId, users.photo as ownerPhoto, postings.* FROM postings INNER JOIN users ON postings.userId=users.id) AS posting \
               LEFT OUTER JOIN requests \
               ON requests.postingId=posting.id \
               AND requests.userId=?';

	connection.query(query, [id], (err, result) => {
		if (err) {
			console.log('error getting postings', err);
		} else {
			console.log('DB POSTING RESULTS:', result);
      for (var i = 0; i < result.length; i++) {
        if (!result[i].ownerPhoto) {
          var usrImgPath = '/' + defaultImg[Math.floor(Math.random() * defaultImg.length)];
          result[i].ownerPhoto = usrImgPath;
        }
      }
			callback(result);
		}
	});
}

//get workout id, user associated with that posting
var getSingleWorkout = function(postingId, callback){
	var query = 'select postings.*, users.name, users.photo, users.description, users.friendsNum from postings inner join users on postings.userId=users.id where postings.id=?';
	connection.query(query, [postingId], (err, result) => {
		if (err) {
			console.log('error getting single posting', err);
		} else {
			// console.log('SINGLE POSTING with username RESULT:', result);
			callback(result);
		}
	});
};

//'INSERT INTO posts SET ?', {title: 'test'},

var createWorkout = function(workoutObj, callback) {
	var query = 'INSERT INTO postings SET ?';
	connection.query(query, workoutObj, (err, result) => {
		if (err) {
			console.log('error creating workout', err);
		} else {
			// console.log('created workout result:', result);
			callback(err, result);
		}
	});
};

var createProfile = function(profileObj, callback) {
	var query = 'INSERT INTO profile SET ?';
	connection.query(query, profileObj, (err, result) => {
		if (err) {
			console.log('error creating profile', err);
		} else {
			// console.log('created profile result:', result);
			callback(result);
		}
	});
};




// send back user requests (accepts and pendings) by postings id
var getUserPostings = function(userId, callback) {

	var query = 'select * from postings where userId=?';
	// var query = 'select p.location, p.date, p.duration, p.details from postings p where userId=?'
	connection.query(query, [userId], (err, result) => {
		if (err) {
			console.log('error getting posting by userId', err);
		} else {
			// console.log('success posting by userId:', result);
			callback(result);
		}
	});
};

var getRequestsByPostingId = function(postingId, callback) {
	var query = `
    SELECT r.postingId, r.userId, r.status, p.title,p.location, p.date, p.duration, u.name, p.private, p.currentEvent, p.currentLevel
    FROM requests r JOIN postings p on r.postingId = p.id join users u  on r.userId = u.id where r.postingId = ?`;
	connection.query(query, [postingId], (err, result) => {
		if (err) {
			console.log('error getting posting by userId', err);
		} else {
			// console.log('success posting by userId:', result);
			callback(result);
		}
	});
};


var getUserRequestPostings = function(userId, callback) {
//title, loation, date, duration
	var query = 'select p.location,p.title,p.currentEvent, p.date, p.duration, p.details from requests r left join postings p on r.postingId = p.id where r.status = "pending" and r.userId = ?';
	connection.query(query, [userId], (err, result) => {
		if (err) {
			console.log('error getting requests by userId', err);
		} else {
			// console.log('success requests by userId:', result);
			callback(result);
		}
	});
};

var getUserAllRequests = function(userId, callback) {
//title, loation, date, duration
	var query = 'select p.location,p.title,p.currentEvent, p.date, p.duration, p.details,r.status from requests r left join postings p on r.postingId = p.id where r.userId = ?';
	connection.query(query, [userId], (err, result) => {
		if (err) {
			console.log('error getting requests by userId', err);
		} else {
			// console.log('success requests by userId:', result);
			callback(result);
		}
	});
};

var createRequest = function(requestObj, callback) {
	var query = 'INSERT INTO requests SET ?';
	connection.query(query, requestObj, (err, result) => {
		if (err) {
			console.log('error creating request', err);
		} else {
			// console.log('created request:', result);
			callback(result);
		}
	});
};

var createPair = function(requestObj, callback) {
	var query = 'INSERT INTO requests SET ?';
	connection.query(query, requestObj, (err, result) => {
		if (err) {
			console.log('error creating request', err);
		} else {
			// console.log('created request:', result);
			callback(result);
		}
	});
};

var getUserInvitesPostings = function(userId, callback) {
	var query = 'select p.location, p.currentEvent, p.title, p.date, p.duration, p.details, users.name from requests r left join postings p on r.postingId = p.id left join users on p.userId=users.id where r.UserId = ? and r.status = ?';
	connection.query(query, [userId, 'invite'], (err, result) => {
		if (err) {
			console.log('error getting accepted requests', err);
		} else {
			// console.log('accepted requests', result);
			callback(result);
		}
	});
};


var updateRequestAccept = function(postingId, callback) {
	var query = "UPDATE requests SET STATUS = ? WHERE postingId=?";
	connection.query(query, ['accept', postingId], (err, result) => {
		if (err) {
			console.log('error updating reqest', err);
		} else {
			// console.log('updated request to accept!', result);
			callback(result);
		}
	});
};
var updateRequestReject = function(postingId, callback) {
	var query = "UPDATE requests SET STATUS = ? WHERE postingId=?";
	connection.query(query, ['reject', postingId], (err, result) => {
		if (err) {
			console.log('error updating reqest', err);
		} else {
			// console.log('updated request to accept!', result);
			callback(result);
		}
	});
};

var checkFriendsStatus = function(originator, receiver, callback) {
  var query = "SELECT status FROM friends WHERE (originator=? AND receiver=?)";
	connection.query(query, [originator, receiver], (err, result) => {
		if (err) {
			console.log('error checking friendship status');
		} else {
			console.log(`status between user ${originator} and user ${receiver} is: `, result[0]);
			callback(result[0]);
		}
	});
}

var createFriendsRequest = function(originator, receiver, callback) {
  var query = "INSERT INTO friends (originator, receiver, status) VALUES (?, ?, ?)";
  connection.query(query, [originator, receiver, 'pending'], (err, result) => {
    if (err) {
      console.log('error updating friend request', err);
    } else {
      // console.log('created friends request!', result);
      callback(result);
    }
  })
}

var updateFriendsNum = function(originator, receiver, callback) {
  var query = 'UPDATE users SET friendsNum = friendsNum + 1 WHERE (id=? OR id=?)';
  connection.query(query, [originator, receiver], (err, result) => {
		if (err) {
			console.log('error updating friends number');
		} else {
			console.log('success updating friends number', result);
			callback(result);
		}
	});
}

var updateFriendsRequest = function(action, id, originator, receiver, callback) {
  var query = "UPDATE friends SET STATUS=? WHERE id=?";
  connection.query(query, [action, id], (err, result) => {
    if (err) {
      console.log('error updating friend request', err);
    } else {
      console.log('updated friends request to accept!', result);
      if(action==='accept') {
        updateFriendsNum(originator, receiver, (result) => console.log(result));
      }
      callback(result);
    }
  })
}

var getFriendsList = function(userId, callback) {
  var query = `SELECT * FROM users INNER JOIN (SELECT receiver AS id FROM friends
               WHERE (originator=? AND status='accept') UNION ALL SELECT originator
               FROM friends WHERE (receiver=? AND status='accept')) AS allFriends
               WHERE users.id = allFriends.id`;
  connection.query(query, [userId, userId], (err, result) => {
    if (err) {
			console.log('error getting friends list', err);
		} else {
			callback(result);
		}
  })
}

var newSubscription = function(subscriberId, publisherId, callback) {
  var query = "INSERT INTO subscription (subscriberId, publisherId) VALUES (?, ?)";
    connection.query(query, [subscriberId, publisherId], (err, result) => {
      if (err) {
        console.log('error creating new subscription');
      } else {
        console.log('new subscription created', result);
        callback(result);
      }
    })
}

var checkSubExist = function(subscriberId, publisherId, callback) {
  var query = "SELECT * FROM subscription WHERE subscriberId=? AND publisherId=?";
  connection.query(query, [subscriberId, publisherId], (err, result) => {
    if (err) {
      console.log('error checking subscription');
    } else {
      console.log(result);
      callback(result);
    }
  })
}

var getSubList = function(userId) {
	var query = "SELECT publisherId FROM subscription WHERE subscriberId=?";
	return new Promise((resolve, reject) => {
		connection.query(query, [userId], (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

var searchUsers = function(term) {
	var query = `SELECT * FROM users WHERE name LIKE "%${term}%"`;

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		})
	});
}

var serachPostings = function(term) {
	var query = `SELECT * FROM postings WHERE title LIKE "%${term}%"`;

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

var updateProfilePic = function(username) {
	var imgPath = '';
  for (var i = 0; i < username.length; i++) {
    if (username.charAt(i) === ' ') {
      imgPath += '_';
    } else {
      imgPath += username.charAt(i);
    }
  }
	var query = `UPDATE users SET photo=? WHERE name=?`;
	var value = [`/pic/usr/${imgPath}`, username];

	return new Promise((resolve, reject) => {
		connection.query(query, value, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

var updateDescription = function(options, callback) {
  var query = 'UPDATE users SET description=? where id=?';
  connection.query(query, [options.description,options.id], (err, result) => {
		if (err) {
			console.log('error updateDescription');
		} else {
			console.log('success updateDescription:', result);
			callback(null,result);
		}
	});
}

var updateEventPic = function(title, username) {
  var fname = '';
  for (var i = 0; i < username.length; i++) {
    if (username.charAt(i) === ' ') {
      fname += '_';
    } else {
      fname += username.charAt(i);
    }
  }
  fname += '-_-';
  for (var i = 0; i < title.length; i++) {
    if (title.charAt(i) === ' ') {
      fname += '_';
    } else {
      fname += title.charAt(i);
    }
  }
	var query = `UPDATE postings SET photo=? WHERE title=?`;
	var value = [`/pic/event/${fname}`, title];

	return new Promise((resolve, reject) => {
		connection.query(query, value, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

var getFriendsRequests = function(userId, cb) {
  var qForSent = 'select f.*, users.name, users.photo, users.description from friends f join users on f.receiver=users.id where status="pending" and originator=' + userId;
  var qForReceived = 'select f.*, users.name, users.photo, users.description from friends f join users on f.originator=users.id where status="pending" and receiver=' + userId;
  connection.query(qForSent, (err, result1) => {
    if(err) throw err;
    var response = {};
    response.sent = result1;
    connection.query(qForReceived, (err, result2) => {
      if(err) throw err;
      response.received = result2;
      cb(response);
    })
  })
}

//insert into postings (title, location, date, duration, details, meetup_spot, buddies, userId) values ('hike', 'sf', '2017-01-01 00:00:00', 1, 'hike in muir woods', 'parking', 2, 1);

module.exports = {
  getFriendsRequests,
  getUserAllRequests,
  updateDescription,
  findByFB,
  insertFBuser,
	checkUser,
  checkSubExist,
	comparePassword,
	createUser,
	getWorkouts,
	getSingleWorkout,
	createWorkout,
	createProfile,
	findById,
	getUserPostings,
	getUserRequestPostings,
	createRequest,
	createPair,
	getUserInvitesPostings,
	getRequestsByPostingId,
	updateRequestAccept,
  updateRequestReject,
  checkFriendsStatus,
  createFriendsRequest,
  updateFriendsRequest,
  getFriendsList,
  newSubscription,
  getSubList,
	searchUsers,
	serachPostings,
	updateProfilePic,
	updateEventPic,
	findMultiplyById
};
