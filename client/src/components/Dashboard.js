import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import ProfilePic from './ProfilePic';
import Profile from './Profile';
import DashNav from './DashNav';
import Workouts from './Workouts';
import Requests from './Requests';
import Friends from './Friends';
import Invites from './Invites';


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'my workouts',
      data: [],
      var: true
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.update = this.update.bind(this);
    this.dataPull = this.dataPull.bind(this);
  }

  dataPull() {
    fetch('/dashboard/all', { credentials: "include" })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        this.setState({ data: response})
      })
      .catch(err => console.log(err))

    console.log('getting dashboard data...')
  }

  update = (postingId, action) => {
    console.log(postingId);
    fetch(`/postings/${action}/${postingId}`, { method: "PATCH" })
      .then(response => {
        var newVar = !this.state.var;
        this.setState({var:newVar})
        this.dataPull();
      });
  }

  handleTabClick(e, { name }) {
    console.log('I\'ve been clicked, and my name is: ' + name);
    this.setState({ view: name });
  };

  componentDidMount() {
    this.dataPull();
  }

  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  user = '/' + this.images[Math.floor(Math.random() * this.images.length)];

  render() {
    // console.log('RENDERRENDER');
    var { listings } = this.props;
    return (
      <Container style={{marginTop: '20px'}}>
      { console.log('getting data from dashboard:',this.state.data)}
        <ProfilePic user={(this.props.user && this.props.user.photo) || ''} default={this.user}/>
        <Profile user={this.props.user}/>

        <DashNav
          handleClick={this.handleTabClick}
          view={this.state.view}
          fetchProfile={this.props.fetchProfile}
        />

        {this.state.view === 'my workouts' &&
          (<Workouts data={this.state.data}
            user={this.user}
            update={this.update}
          />)}
        {this.state.view === 'my requests' && ([<Requests />])}
        {this.state.view === 'friends' && ([<Friends getFriends={this.props.getFriends}/>])}
        {this.state.view === 'invites' && ([<Invites />])}

      </Container>
    )
  }
}

export default Dashboard;
