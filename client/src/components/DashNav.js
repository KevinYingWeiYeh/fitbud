import React, { Component } from 'react';
import { Menu,Icon, Button, Modal, Header,Form,TextArea } from 'semantic-ui-react';

class DashNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description:'',
      open: false
    }
  }

  showModal = () => this.setState({open: true})

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {

    const { description } = this.state;
    console.log('submit popup',this.state);
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(this.state)
    }

    fetch('/description', options)
      .then(response => {
        if (response.ok) {
          this.props.fetchProfile();
        }
      })
    this.setState({open:false, description:''})
  }

  close = () => this.setState({ open: false })

  render() {
    return (
      <Menu tabular>
        <Menu.Item name='my workouts'
          active={this.props.view === 'my workouts'}
          onClick={this.props.handleClick} />
        <Menu.Item name='my requests'
          active={this.props.view === 'my requests'}
          onClick={this.props.handleClick} />
        <Menu.Item name='invites'
          active={this.props.view === 'invites'}
          onClick={this.props.handleClick} />
        <Menu.Item name='friends'
          active={this.props.view === 'friends'}
          onClick={this.props.handleClick} />
        <Menu.Item name='setting' position='right'>

          <Modal open={this.state.open}
            trigger=
            {<Button icon='setting' size='small' onClick={this.showModal} bordered/>}
            dimmer='blurring'
            size='tiny'
            closeOnRootNodeClick={true}
            onClose={this.close}>
            <Modal.Header>Profile Setting</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field control={TextArea} label='Personal Description' name='description'
                  value={this.state.description} onChange={this.handleChange}
                  placeholder='Introduce yourself a little bit, let other buddies know who you are '
                  />
                <Button color='teal' >
                  Submit
                </Button>
              </Form>
            </Modal.Content>
          </Modal>
        </Menu.Item>
      </Menu>
    )
  }

}

export default DashNav;
