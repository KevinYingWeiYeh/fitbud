import React, { Component } from 'react';
import { Input, Form, Button, Grid, Icon, Card, Feed, Transition } from 'semantic-ui-react';
import Messaging from './Messaging';

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showMessaging: false
    }
  }

  componentDidMount() {
    this.setState({visible: true});
  }
  //
  // handleClick = (index) => {
  //   this.setState({selected: this.props.friends[index]});
  //   var selected = this.state.selected;
  //   if (!selected || (selected === this.props.friends[index]) || !this.state.showMessaging) {
  //     this.setState({showMessaging: !this.state.showMessaging});
  //   }
  // }

  handleClick = (friend) => { this.props.addToInvite(friend) };

  render() {
    var { sendDisabled, selected, showMessaging } = this.state;
    var { user, friends } = this.props;
    console.log('selected: ', selected);
    console.log('showMessaging: ', showMessaging);

    return (
      <Feed>
        {friends.map((friend, index) =>
          <Feed.Event key={index} onClick={() => this.handleClick(friend)}>
            <Feed.Label image={friend.photo} />
            <Feed.Content>
              <Feed.Summary>
                {friend.name}
                <Icon name='add user' disabled={false} style={{marginLeft: '5px'}} />
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )}
      </Feed>
    );
  }
}

export default FriendsList;
