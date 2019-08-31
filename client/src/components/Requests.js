import React, { Component } from 'react';
import { Card, Icon, Image, Label } from 'semantic-ui-react';

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [1,2,3,4,5,9,'a'],
      pending: [],
      accepted:[],
      rejected:[]
    };
  }

  componentDidMount() {
    fetch('/dashboard/requests', { credentials: "include" })
      .then(response => response.json()
        .then(
          response => {

            this.setState({
              pending: response.filter(req => req.status === 'pending'),
              accepted: response.filter(req => req.status === 'accept'),
              rejected: response.filter(req => req.status === 'reject')
            });
            console.log(response);
          }
        )
      )

    console.log('getting requests...')
  }

  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  render() {
    return (
      <Card.Group itemsPerRow={3}>
        {this.state.accepted.map(listing => (
          <Card>

            <Card.Content >
              <Label color='green' horizontal style={{float:'right'}}>accepted</Label>
              <Card.Header>{listing.title.toUpperCase()}</Card.Header>
              <Card.Meta><Icon name='marker' />{listing.location}</Card.Meta>
              <Card.Description>
                {`Schedule on ${new Date(listing.date).toDateString()}`}
              </Card.Description>
              <Card.Description>
                {`for ${listing.duration} hours`}
              </Card.Description>
              <Image src={`${this.state.event[listing.currentEvent]}_on.svg`} size='mini' floated='right' style={{margin:'10px'}}/>

            </Card.Content>
          </Card>
        ))}

        {this.state.pending.map(listing => (
          <Card>

            <Card.Content>
              <Label color='orange' horizontal style={{float:'right'}}>pending</Label>
              <Card.Header>{listing.title.toUpperCase()}</Card.Header>
              <Card.Meta><Icon name='marker' />{listing.location}</Card.Meta>
              <Card.Description>
                {`Schedule on ${new Date(listing.date).toDateString()}`}
              </Card.Description>
              <Card.Description>
                {`for ${listing.duration} hours`}
              </Card.Description>
              <Image src={`${this.state.event[listing.currentEvent]}_on.svg`} size='mini' floated='right' style={{margin:'10px'}}/>
            </Card.Content>
          </Card>
        ))}
        {this.state.rejected.map(listing => (
          <Card>
            <Card.Content >
              <Label color='red' horizontal style={{float:'right'}}>rejected</Label>
              <Card.Header>{listing.title.toUpperCase()}
            </Card.Header>
              <Card.Meta><Icon name='marker' />{listing.location}</Card.Meta>
              <Card.Description>
                {`Schedule on ${new Date(listing.date).toDateString()}`}
              </Card.Description>
              <Card.Description>
                {`for ${listing.duration} hours`}
              </Card.Description>
              <Image src={`${this.state.event[listing.currentEvent]}_on.svg`} size='mini' floated='right' style={{margin:'10px'}}/>

            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    )
  }

}

export default Requests;
