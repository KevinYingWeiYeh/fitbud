import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Form, Button, Card, Feed, Transition, Dimmer, Loader } from 'semantic-ui-react';
import moment from 'moment';

class Messaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      messages: [],
      sendDisabled: true,
      input: '',
      loading: false
    }


    this.database = window.firebase;
  }

  componentDidMount() {
    this.setState({sendDisabled: false});
    this.setState({visible: true});
    this.scrollToBottom();
    // setInterval(() => {
    //   this.setState({message: this.state.messages});
    // }, 45000);

    this.updateMessages(this.props.user, this.props.friend);
  }

  componentWillReceiveProps(nextProps) {
    var user = this.props.user;
    var current = this.props.friend;
    var next = nextProps.friend;
    if (!next) return;
    if (!current || !this.state.messages.length) {
      // this.setState({loading: true});
      this.updateMessages(user, next);
    } else if (current.id !== next.id) {
      this.database.ref(`chats/${user.id}/${current.id}`).off();
      // this.setState({loading: true});
      this.updateMessages(user, next);
      this.setState({messages: []});
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    var feed = document.getElementById('messageFeed');
    if (feed) {
      feed.scrollIntoView({ behavior: "smooth" });
    }
  }

  writeMessage = (message) => {
    var userId = (this.props.user && this.props.user.id) || null;
    var friendId = (this.props.friend && this.props.friend.id) || null;
    var payload = {
      userId: userId,
      userName: this.props.user.name,
      message: message,
      createdAt: Date.now()
    }
    console.log(payload);
    this.database.ref(`chats/${userId}/${friendId}`).push().set(payload);
    this.database.ref(`chats/${friendId}/${userId}`).push().set(payload);
  }

  updateMessages = (user, friend) => {
    var userId = (user && user.id) || null;
    var friendId = (friend && friend.id) || null;
    this.database.ref(`chats/${userId}/${friendId}`).on('child_added', (data) => {
      this.setState({message: this.state.messages.push(data.val())}, () => {
        this.setState({loading: false});
      })
    });
  }

  handleChange = (e, data) => {
    this.setState({input: data.value});
  }

  handleSubmit = (e) => {
    this.setState({input: ''});
    this.writeMessage(this.state.input);
  }

  render() {
    var { sendDisabled, messages, loading, input } = this.state;
    var { friend, user } = this.props;
    console.log('friend', friend);

    const messagingStyle = {
      height: '400px',
      overflowY: 'auto'
    }

    return (
      [<Card raised={true}>
        <Card.Content>
          <Card.Header>
            {(this.props.friend && this.props.friend.name) || ''}
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Feed id='messageFeed' style={messagingStyle}>
            {loading ?
              (<Dimmer active inverted>
                <Loader inverted content='Loading' />
              </Dimmer>) :
              (messages.map((message, index) =>
                <Feed.Event key={index} style={{marginTop: '5px'}}>
                  {(message.userId === (friend && friend.id)) && <Feed.Label image={friend.photo} />}
                  <Feed.Content style={{textAlign: message.userId === (user && user.id) ? 'right' : 'left',
                                        marginRight: '10px'}}>
                    <Feed.Date content={moment(message.createdAt).fromNow()}/>
                    <Feed.Summary>
                      {message.message}
                    </Feed.Summary>
                  </Feed.Content>
                  {/* {message.userId === (this.props.user && this.props.user.id) ? <Feed.Label image='elliot.jpg' /> : <div></div>} */}
                </Feed.Event>
              ))}
          </Feed>
        </Card.Content>
        <Form onSubmit={this.handleSubmit}>
          <Input disabled={sendDisabled} action={{icon: 'send'}} fluid={true}
            placeholder='Message...' onChange={this.handleChange}
            value={input} />
        </Form>
      </Card>]
    );
  }
}

export default Messaging;
