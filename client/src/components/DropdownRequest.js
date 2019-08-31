import React, { Component } from 'react';
import { Card, Icon, Image, Accordion, Button } from 'semantic-ui-react';

class DropdownRequest extends Component {

  render() {
    return(
    <div>
      {this.props.requests.map(request => (
        <IndividualRequest request={request} update={this.props.update} />
      ))}
    </div>
    );
  }
}

class IndividualRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    }
  }

  render() {
    console.log(this.props.request.status, this.state.clicked);
    if (this.props.request.status === 'pending' && !this.state.clicked) {
      return(
        <div>
          <span>
            {this.props.request.name}
          </span>
          <span>
            <Button basic color='green' size='mini' style={{margin: '10px'}}
              onClick={() => {
                this.props.update(this.props.request.postingId, 'accept');
                this.setState({clicked: 'accept'})
              }} >
              Accept
            </Button>
            <Button basic color='red' size='mini' style={{margin: '10px'}}
              onClick={() => {
                this.props.update(this.props.request.postingId, 'reject');
                this.setState({clicked: 'reject'})
              }} >
              Reject
            </Button>
          </span>
        </div>
      );
    } else if (this.props.request.status === 'accept' || this.state.clicked === 'accept'){
      return(
        <div>
          <span style={{color: '#21ba45'}}>
            {this.props.request.name}
          </span>
          <span style={{color: '#21ba45', margin: '10px'}}>
            Acceptted!
          </span>
        </div>
      )
    } else {
      return(
        <div>
          <span style={{color: '#21ba45'}}>
            {this.props.request.name}
          </span>
          <span style={{color: '#FF0000', margin: '10px'}}>
            Rejected!
          </span>
        </div>
      )
    }
  }
}

export default DropdownRequest;
