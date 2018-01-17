var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
try{
  var configAuth = require('./auth');
} catch {
  var configAuth = {
    'facebookAuth' : {
        'clientID'      : process.env.FBID, // your App ID
        'clientSecret'  : process.env.FBS, // your App Secret
        'callbackURL'   : process.env.FBCBURL,
    }
  };
}
var db = require('../database/index.js');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('username and password:', username, password);
      db.checkUser(username, function (err, dbUserResult) {
        console.log('user inside passport:', dbUserResult)
        if (err) { return done(err); }
        if (!dbUserResult) { return done(null, false); }
        db.comparePassword(password, dbUserResult[0].password, function(err, isMatch){
          //console.log('inside passports compare password');
          if (err) {
            //console.log('cannot compare passwords');
          }
          if(isMatch) {
            return done(null, dbUserResult[0], {message: 'password matched'});
          } else {
            //console.log('checking for invalid password')
            return done(null, false, {message: 'invalid password'});
          }
        });


    });

  }));

  passport.use(new FacebookStrategy(
    {
      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL,
      passReqToCallback: true,
      profileFields: ['id', 'emails', 'name', 'displayName', 'gender']
    },

      // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {
      //console.log('UMI FACEBOOK', token, refreshToken, profile);

      process.nextTick(function() {
        db.findByFB(profile.id, function(err, user) {
          if (err)
              return done(err);
          // if the user is found, then log them in
          if (user) {
              return done(null, user); // user found, return that user
          } else {
              // if there is no user found with that facebook id, create them
              var newUser = {};
              // set all of the facebook information in our user model
              newUser.id    = profile.id; // set the users facebook id
              newUser.token = token; // we will save the token that facebook provides to the user
              newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
              newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
              newUser.gender = profile.gender;

              // save our user to the database
              db.insertFBuser(newUser, function(err) {
                  if (err)
                      throw err;
                  return done(null, newUser);
              });
           }

        });
      });

    })
  );



  passport.serializeUser(function(user, done) {
    //console.log('user in serialize', user);
    console.log('UUUSWE', user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
//    console.log('in deserialize', id);
    db.findById(id, function(err, user) {
    // console.log('user in deserialize', user);
      done(err, user);
    });
  });
}
