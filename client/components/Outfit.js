import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router'
const axios = require('axios');
import Moment from 'react-moment';

class Outfit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected,
    }
    this.handleClick = this.handleClick.bind(this);
    this.checkCurrentDate = this.checkCurrentDate.bind(this);
  }

  // Allows user to click on an item. This sends a post request that stores the selected combonation of 
  // top, bottom, and shoes to the user's history. 
  handleClick(topId, bottomId, shoesId) {
    axios.post('/api/outfits', {
      top: topId,
      bottom: bottomId,
      shoes: shoesId,
    })
    .then(response => {
      this.checkCurrentDate();
      this.props.history.push("/history")
    }).catch(error => {
      console.log(error, '- Get outfit selection');
    })
  }

  // Checks if the user has already slected an outfit of the day.
  checkCurrentDate() {
    axios.get('/api/outfits/today')
    .then(response => {
      this.setState ({
        selected: response.data
      })
    }).catch(error => {
      console.log(error, '- Check current date outfit exists');
    })
  }

  // Renders today's outfit
  render() {

    const { top, bottom, shoes } = this.props.item;

    return (
      <div className="outfit-block" onClick={() => this.handleClick(top.id, bottom.id, shoes.id)}>
        <img src={top.image} />
        <img src={bottom.image} className="bottom"/>
        <img src={shoes.image}/>
      </div>
    )
  }
}

export default withRouter(Outfit);
