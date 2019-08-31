import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class ListingNav extends Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentWillMount() {
    this.setState({active: 'all'});
  }

  handleItemClick(event, {name}) {
    this.props.updateActive(name);
    this.props.toggleFilter(name);
    this.setState({
      active: name,
    });
  }

  handleSortChange(event, {name}) {
    this.props.updateSorting(name);
  }

  render() {
    return (
      <Menu text>
        <Menu.Item header>Show: </Menu.Item>
        <Menu.Item name='all' active={this.state.active === 'all'} onClick={this.handleItemClick} />
        {this.props.user && <Menu.Item name='subscribed' active={this.state.active === 'subscribed'} onClick={this.handleItemClick} />}
        <Menu.Menu position='right'>
          <Menu.Item header>Sort by: </Menu.Item>
          <Menu.Item name='date' active={this.props.sorting === 'date'} onClick={this.handleSortChange} />

        </Menu.Menu>
      </Menu>
    );
  }

}

export default ListingNav;

          // <Menu.Item name='location' active={this.props.sorting === 'location'} onClick={this.handleSortChange} />
