import React, { Component } from 'react';
import { Card, Container, Icon, Transition, Grid, Rail } from 'semantic-ui-react';
import ListingCard from './ListingCard.js';
import ListingModal from './ListingModal.js';
import Messaging from './Messaging.js';
import ListingNav from './ListingNav.jsx';

class Listings extends Component {
  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      listings: [],
      showModal: false,
      selectedListing: null,
      active: 'all',
      sorting: 'date',
    }
    this.updateActive = this.updateActive.bind(this);
    this.updateSorting = this.updateSorting.bind(this);
    this.listingsCompare = this.listingsCompare.bind(this);
  }

  updateListings = () => {
    fetch('/postings', {
      credentials: 'include'
    }).then(response => response.json())
      .then(listings => {

        this.setState({listings: listings});
          // listings.sort(this.listingsCompare)});

        if ((this.props.modal !== null)) {
          var tempListing;
          for (var i = 0; i < this.state.listings.length; i++) {
            if (this.props.modal.title === this.state.listings[i].title) {
              tempListing = this.state.listings[i];
            }
          }
          this.setState({
            showModal: true,
            selectedListing: tempListing,
          });
        }
      });
  }

  updateActive(name) {
    this.setState({
      active: name,
    });
  }
  updateSorting(name) {
    this.setState({
      sorting: name,
      listings: this.state.listings.sort(name === 'date' ? this.dateCompare : this.locationCompare),
    });
  }

  dateCompare(a, b) {
    var c = new Date(a.date);
    var d = new Date(b.date);
    //compare year, month, date
    if(c.valueOf() > d.valueOf()) {
      return 1;
    } else if (c.valueOf() < d.valueOf()) {
      return  -1;
    } else {
      return 0;
    }
  }
  locationCompare(a, b) {

  }
  listingsCompare(a, b) {
    if (this.state.sorting === 'date') {
      return this.dateCompare(a,b);
    } else {
      return this.locationCompare(a,b);
    }
  }


  componentDidMount() {
    this.setState({visible: true})

    this.updateListings();
  }

  showListingModal(listing) {
    this.setState({
      showModal: true,
      selectedListing: listing
    })
  }

  hideListingModal = () => {
    this.updateListings();

    this.setState({
      showModal: false,
      selectedListing: null
    });
    this.props.doneEventSearch();
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    var { listings, showModal, selectedListing, contextRef } = this.state;

    var cardGridCol = [[],[],[]];
    for (var i = 0; i < listings.length; i++) {
      cardGridCol[i%3].push((
        <ListingCard
          listing={listings[i]}
          showListingModal={this.showListingModal.bind(this)}
          key={i} />
      ));
    }

    var cardGrid = listings.length !== 0 ? (
      <Grid columns='equal'>
        <Grid.Column>
          {cardGridCol[0]}
        </Grid.Column>
        <Grid.Column>
          {cardGridCol[1]}
        </Grid.Column>
        <Grid.Column>
          {cardGridCol[2]}
        </Grid.Column>
      </Grid>
    ) : null;

    return ([
      <Transition visible={this.state.visible} duration={1000} animation='fade'>

        <Container style={{marginTop: '20px'}}>
          <ListingNav user={this.props.user} updateSorting={this.updateSorting} updateActive={this.updateActive} active={this.state.active} sorting={this.state.sorting}/>
          {cardGrid}
        </Container>
      </Transition>,
      <Container>
        {this.state.showModal && (
          <ListingModal listing={selectedListing} open={this.state.showModal}
                        hideListingModal={this.hideListingModal}
                        user={this.props.user}
          />
        )}
      </Container>]
    )
  }
}

export default Listings;


