import React, { Component } from 'react';
import { Header, Segment, Input, Container, Image, List, Button, Form, TextArea } from 'semantic-ui-react';



class Profile extends Component {
  render() {

    // console.log('profile render', this.props.user);
    const { user } = this.props;



    const ShowDescription = (props) => (
      <Container style={{width: '400px','font-style': 'italic','font-size':'16px','color':'#3BC4B2'}}  textAlign='center' >
        <p>{props.description}</p>
      </Container>
    )

    const NameHeader = () => (
      <div>
        <Header as='h2' textAlign='center' style={{margin: '10px'}}>
          <Header.Content>
            {user.name}
          </Header.Content>
        </Header>
        {user.description ?
          <ShowDescription description={user.description} handleSubmit={this.handleSubmit}/>
          : ''
        }
      </div>
    )


    return (

      <Container style={{"textAlign": "center"}}>
        { user ?
          NameHeader()
        : <h2></h2>
        }
      </Container>

    );
  }
}

export default Profile;
{/* <Button onClick={props.handleSubmit} icon='write' color='white' floated='right'/> */}
