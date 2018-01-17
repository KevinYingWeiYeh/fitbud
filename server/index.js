var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var db = require('../database/index.js');
var flash = require('connect-flash');
var cors = require('cors')

var options = {
  host: process.env.DBSERVER || 'localhost',
  port: 3306,
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || 'root',
  database: process.env.DBNAME || 'fitbud',
  checkExpirationInterval: 60000,
  expiration: 3600000,
}
var sessionStore = new MYSQLStore(options);

var app = express();
app.use(morgan('dev'));
app.use(cors());

var routeRegister = require('../routes/register');
// var routeLogin = require('../routes/login');
// var routeFBLogin = require('../routes/fblogin');
var routePostings = require('../routes/postings');
var routeProfile = require('../routes/profile');
var routeFriends = require('../routes/friends');
var routeSubscription = require('../routes/subscription');
var routeWorkout = require('../routes/workout');
var routeDashboard = require('../routes/dashboard');
var routeLogout = require('../routes/logout');
var routeSearch = require('../routes/search');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 3600000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('../config/passport.js')(passport);

app.use(function (req, res, next) {
  // console.log('body', req.body);
  // console.log('session', req.session);
  // console.log('isAuth?', req.isAuthenticated());
  // console.log('req user:', req.user);
  // console.log('cookie', req.cookies);
  next();
})

app.use('/register', routeRegister);

app.use('/postings', routePostings);

app.post('/login',
  passport.authenticate('local', {failureFlash: true, successFlash: true}),


  function(req, res) {
    res.json(req.user);
});

app.get('/login', (req, res) => {
  //console.log('login get')
  res.end();
});

app.use(function (req, res, next) {
  //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //console.log('body', fullUrl);
  // console.log('session', req.session);
  // console.log('isAuth?', req.isAuthenticated());
  // console.log('req user:', req.user);
  // console.log('cookie', req.cookies);
  next();
})
app.get('/auth/facebook',(req, res, next) => {
  //console.log('AUTH/FACE');
  next()
},
  passport.authenticate('facebook',{ scope : ['email']}));

app.get(
  '/auth/facebook/callback',
	passport.authenticate(
    'facebook',
    {
		  failureRedirect : '/'
	  }
  ),
  (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host');
    console.log("REQEUST UMIUMIUMI", fullUrl);
    if (fullUrl.includes('localhost')) {
      res.redirect('http://localhost:3000');
    } else {
      res.redirect(fullUrl);
    }
  }
);
//for updating profile Description
app.post('/description',(req, res) => {
  var options = req.body;
  options.id =req.session.passport.user
  db.updateDescription(options, (err, result) => {
    if(err) {
      console.log('description err');
      throw err;
    } else {
      res.redirect('/dashboard')
    }
  })
})

app.use('/search', routeSearch);
// app.use(express.static('client/build'));


app.use(checkAuth);

// Below are the protected routes
app.use('/profile', routeProfile);
app.use('/friends', routeFriends);
app.use('/subscription', routeSubscription);
app.use('/workout', routeWorkout);
app.use('/dashboard', checkAuth, routeDashboard);
app.use('/logout', routeLogout);

// middleware function to check if this is one of the protected routes

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) { //check if it's an authenticated route
    next();
  }
  else {
    res.redirect('/')
    //res.status(401).json({});
  }
}

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname,'../client/public/index.html'))
});

app.listen(process.env.PORT || 3001, function(err){
	if(err) {
		console.log('cannot connect to the server');
	}
	console.log(`listening on ${process.env.PORT || 3001}`);
})


// express session
// express validator
