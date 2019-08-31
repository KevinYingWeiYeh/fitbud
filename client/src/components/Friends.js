import React, { Component } from 'react';
import { Card, Icon, Image, Label, Button } from 'semantic-ui-react';

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sent: [],
      received:[]
    }
  }

  fetchFriendsReq () {
    fetch('/friends/requests', { credentials: "include" })
      .then(response => response.json()
        .then(
          response => {
            this.setState({ sent: response.sent, received: response.received });
            console.log('FETCH FRIENDS',response);
          }
        )
      )
  }

  handleAction (action, id, originator, receiver) {
    var data={action:action,id:id,originator:originator,receiver:receiver}
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(data),
    }
    console.log(action, id);
    this.props.getFriends();
    fetch('/friends/action', options)
    this.fetchFriendsReq();
  }

  componentDidMount() {
    this.fetchFriendsReq();
  }

  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  render() {
    //console.log('Friends');
    var cardStyle = {
      border: 'none',
      margin: 10
    }
    return (
      <Card.Group itemsPerRow={3}>
        {this.state.received.map(friend => (
          <Card style={cardStyle}>
            <Card.Content>
              <Image floated='right' size='tiny' src={(friend && friend.photo) ? friend.photo : ''} />
              <Card.Header>
                {(friend && friend.name) ? friend.name : ''}
              </Card.Header>
              <Card.Description>
                {(friend && friend.description) ? friend.description : ''}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button.Group floated='right' size='small'>
                <Button name='reject'
                  onClick={() => {this.handleAction('reject',friend.id,friend.originator,friend.receiver)}}>
                  Reject
                </Button>
                <Button name='accept'
                  color='teal'
                  onClick={() => {this.handleAction('accept',friend.id,friend.originator,friend.receiver)}}>
                  Accept
                </Button>
              </Button.Group>
            </Card.Content>
          </Card>
        ))}
        {this.state.sent.map(friend => (
          <Card style={cardStyle}>
            <Card.Content>
              <Image
                floated='right' size='tiny'
                src={(friend && friend.photo) ? friend.photo : ''}
              />
              <Card.Header>
                {(friend && friend.name) ? friend.name : ''}
              </Card.Header>
              <Card.Description>
                {(friend && friend.description) ? friend.description : ''}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Card.Description color='teal'>
                <Label color='orange' horizontal style={{float:'right'}}>Request pending</Label>
              </Card.Description>
            </Card.Content>
          </Card>

        ))}

      </Card.Group>
    )
  }

}

export default Friends;
