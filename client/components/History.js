import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styles from "../index.css";
const axios = require('axios');
import Moment from 'react-moment';
import PreviousOutfit from './PreviousOutfit';

class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      prevOutfits: [],
      currentUser: 'robb'
    }

    this.handleDeletePrevOutfit = this.handleDeletePrevOutfit.bind(this)
  }

  componentDidMount() {
   axios.get('/api/history/' + this.state.currentUser)
   .then(response => {
     this.setState ({
       prevOutfits: response.data
     })
   }).catch(error => {
     console.log(error, '- Get previous outfits');
   })
  }

  handleDeletePrevOutfit(prev) {
    this.setState({
      prevOutfits: prev
    })
  }

  render() {

    const prevOutfits = []
    // console.log(this.state.prevOutfits)
    if (this.state.prevOutfits.length > 0){
      this.state.prevOutfits.map((x, index) => {
        prevOutfits.push(<PreviousOutfit key={index} item={x} handleDeletePrevOutfit={this.handleDeletePrevOutfit} />)
      })
    }

    return (
      <div>
        <div className="main-outfit">
        </div>
        <div className="previous-outfits">
          {prevOutfits}
        </div>
      </div>
    );
  }
}



export default History;
