import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import MainNav from './MainNav';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import Listings from './Listings';
import NoMatch from './NoMatch';
import Dashboard from './Dashboard';
import CreateListing from './CreateListing';
import FriendsList from './FriendsList.js';
import data from '../sampleData';
import { Button } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      user: null,
      visible: null,
      friends: [],
      messagingVisible: false,
      modal: null,
    }
    this.handleUserSearch = this.handleUserSearch.bind(this);
    this.handleEventSearch = this.handleEventSearch.bind(this);
    this.doneEventSearch = this.doneEventSearch.bind(this);
  }

  componentWillMount() {
    this.cookies = new Cookies();
    console.log('checking auth...');
    this.checkAuth();
    this.getFriends();
  }

  componentWillUpdate() {
    console.log('user', this.state.user);
  }

  checkAuth = () => {
    fetch('/profile', {
      credentials: 'include'
    }).then(response => {
      console.log(response);
      return response.ok ? response.json() : {};
    }).then(user => {
      console.log(user);
      if (user && user.name) {
        this.setState({
          user: user,
          authenticated: true
        })
      }
    })
    .catch(err => {console.log('profile',err);});
  }

  getFriends = () => {
    fetch('/friends', { credentials: "include" })
      .then(response => {
        try {
          return response.json()
        } catch (err) {
          return [];
        }
      })
      .then(response => {
        if (Array.isArray(response)) {
          this.setState({friends: response})
        }
      })
      .catch(err => {console.log('App Friends',err);});
  }

  handleAuthenticated = (user) => {
    if(!user.photo){
      var defaultImg = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
      var usrImgPath = '/' + defaultImg[Math.floor(Math.random() * defaultImg.length)];
      user.photo = usrImgPath;
    }
    this.setState({
      authenticated: true,
      user: user
    });
    console.log('User authenticated...');
  }

  handleSignOff = () => {
    this.setState({
      authenticated: false,
      user: null
    });
    fetch('/logout', {
      credentials: 'include'
    }).then(response => console.log(response.status));
  }

  toggleMessaging = () => {
    this.setState({messagingVisible: !this.state.messagingVisible});
  }

  handleUserSearch (userInfo) {
    console.log('here in user search handler', userInfo);

  }

  handleEventSearch(eventInfo) {
    console.log('here in event search handler', eventInfo);
    this.setState({
      modal: eventInfo,
    });
  }

  doneEventSearch() {
    this.setState({
      modal:null,
    });
  }

  render() {
    var { authenticated, user, visible, friends, messagingVisible } = this.state;
    var buttonStyle = {
      position: 'fixed',
      bottom: 0,
      right: 0,
      marginRight: 0,
      zIndex: 100,
      width: '150px',
      height: '40px'
    }
    console.log('DO I HAVE FRIENDS', this.state.friends);
    return (
      <Router>
        <div>

          <MainNav authenticate={this.handleAuthenticated} isAuthed={this.state.authenticated}
                   signoff={this.handleSignOff} user={this.state.user}
                   handleUserSearch={this.handleUserSearch} handleEventSearch={this.handleEventSearch}
                   />
          <Switch>
            <Route exact path='/' render={props => (
              <Home user={this.state.user} {...props} />
            )} />

            <Route exact path='/listings' render={props => (
              <Listings user={this.state.user} modal={this.state.modal} doneEventSearch={this.doneEventSearch} {...props} />
            )} />

            <Route exact path='/about' component={About} />

            <Route exact path='/login' render={props => (
              <Login authenticate={this.handleAuthenticated}
                     getFriends={this.getFriends} {...props} />
            )} />

            <Route exact path='/signup' component={Signup} />

            <Route exact path='/dashboard' render={props => (
              <Dashboard
                listings={data}
                user={this.state.user}
                fetchProfile={this.checkAuth}
                getFriends={this.getFriends}
                {...props}
              />
            )} />

            <Route exact path='/create' render={props => (
              <CreateListing user={user} friends={friends} {...props} />
            )} />

          </Switch>
          {user && <Button onClick={this.toggleMessaging} style={buttonStyle}>Chat</Button>}
          {(user && messagingVisible) && <FriendsList user={user} friends={friends} />}
        </div>
      </Router>
    );
  }
}

export default App;
