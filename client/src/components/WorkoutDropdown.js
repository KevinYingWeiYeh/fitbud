import React, { Component } from 'react';
import { Card, Icon, Image, Accordion, Button } from 'semantic-ui-react';

import DropdownRequest from './DropdownRequest';

class WorkoutDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: -1,
      requests: []
    };
    this.dropdown = this.dropdown.bind(this);
  }

  dropdown = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })

  }

  componentDidMount() {
    var id = this.props.postingId;

    fetch(`/postings/requests/${id}`, { credentials: "include" })
      .then(response => response.json())
      .then(response => {
        console.log('requests response #' + id, response);
        this.setState({ requests: response })
      })
  }


  render() {
    return (
      <div>
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.dropdown}>
            <Icon name='dropdown' />
            Requests ({this.state.requests.length})
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            <DropdownRequest requests={this.state.requests} update={this.props.update} />
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

export default WorkoutDropdown;

//each dropdown list pulls the users that are requesting
