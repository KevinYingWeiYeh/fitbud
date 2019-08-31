import React, { Component } from 'react';
import { Input, Form, Button, Grid, Card, Feed, Transition } from 'semantic-ui-react';
import Messaging from './Messaging';

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showMessaging: false
    }
  }

  componentWillMount() {
    // this.setState({selected: this.props.friends[0]});
    // var token = (this.props.user.id).toString();
    // window.firebase.auth().signInWithCustomToken(token).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorCode, errorMessage);
    //   // ...
    // });
  }

  componentDidMount() {
    this.setState({visible: true});
  }

  componentWillReceiveProps(nextProps) {
    // this.state.selected = nextProps.friends[0];
  }

  // dataPull = () => {
  //   fetch('/friends', { credentials: "include" })
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log('friends', response);
  //       if (Array.isArray(response)) {
  //         this.setState({friends: response})
  //         this.setState({selected: response[0]});
  //       }
  //     })
  //
  //   console.log('getting data...');
  // }

  handleClick = (index) => {
    this.setState({selected: this.props.friends[index]});
    var selected = this.state.selected;
    if (!selected || (selected === this.props.friends[index]) || !this.state.showMessaging) {
      this.setState({showMessaging: !this.state.showMessaging});
    }
  }

  render() {
    var { sendDisabled, selected, showMessaging } = this.state;
    var { user, friends } = this.props;
    const friendsListStyle = {
      position: 'fixed',
      float: 'right',
      right: '0',
      bottom: 0,
      width: '700px',
      zIndex: 99
    }

    return (
      <Grid divided='vertically' style={friendsListStyle} verticalAlign='bottom'>
        <Grid.Row>
          <Grid.Column width={7}>
            {(selected && showMessaging) && <Messaging user={user} friend={selected} />}
          </Grid.Column>
          <Grid.Column width={5}>
            <Card>
              <Card.Content>
                <Card.Header>
                  Friends
                </Card.Header>
              </Card.Content>
              <Card.Content>
                <Feed>
                  {friends.map((friend, index) =>
                    <Feed.Event key={index} onClick={() => this.handleClick(index)}>
                      <Feed.Label image={friend.photo} />
                      <Feed.Content>
                        <Feed.Summary>
                          {friend.name}
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>
                  )}
                </Feed>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default FriendsList;
