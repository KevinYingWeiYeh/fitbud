var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

// we will add the routes for a particular user id
// get all the workouts posted by the user - select * from postings where userId = "x"
//

router.get('/', (req, res) => {
  // console.log('REACHED>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  var id = req.session.passport.user;
  console.log('user id>>>>>>>>>>>:', id);
  db.getFriendsList(id, (dbResult) => {
    // console.log('database RESULTS>>:', dbResult);
    res.send(dbResult);
  })
})

router.get('/requests', (req, res) => {
  console.log('REACHED>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  var id = req.session.passport.user;
  console.log('user id>>>>>>>>>>>:', id);
  db.getFriendsRequests(id, (dbResult) => {
    console.log('database RESULTS>>:', dbResult);
    res.send(dbResult);
  })
})

router.post('/', (req, res) => {
  var {originator, receiver} = req.body;
  db.checkFriendsStatus(originator, receiver, (dbResult) => {
    console.log(dbResult);
    if (!dbResult) {
      db.createFriendsRequest(originator, receiver, (dbResult) => {
        res.send(dbResult);
      })
    }
  })
})
//
// router.get('/status', (req, res) => {
//   console.log('REACHED>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
//   var id = req.session.passport.user;
//   console.log('user id>>>>>>>>>>>:', id);
//   db.getFriendsList(id, (dbResult) => {
//     console.log('database RESULTS>>:', dbResult);
//     res.send(dbResult);
//   })
// })

router.patch('/action', (req, res) => {
  // console.log('workout req query', req.params.id);
  var {action, id, originator, receiver} = req.body;
  db.updateFriendsRequest(action, id, originator, receiver, (result) => {
    //console.log('request created in the table', result);
    res.status(200).send('request accepted');
  });
});


module.exports = router;
