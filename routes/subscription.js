var express = require('express');
var router = express.Router();
var db = require('../database/index.js');

// we will add the routes for a particular user id
// get all the workouts posted by the user - select * from postings where userId = "x"
//

router.get('/', (req, res) => {
  var id = req.session.passport.user;
  db.getSubList(id)
    .then((dbResult) => res.send(dbResult));
})

router.post('/', (req, res) => {
  var {subscriberId, publisherId} = req.body;
  db.checkSubExist(subscriberId, publisherId, (dbResult) => {
    console.log('posting to subscription');
    if (!dbResult.length) {
      db.newSubscription(subscriberId, publisherId, (dbResult) => {
        console.log('database RESULTS>>:', dbResult);
        res.send(dbResult);
      })
    }
    res.statusCode(409);
  })
})

module.exports = router;
