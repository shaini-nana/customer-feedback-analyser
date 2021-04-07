import React, { Component } from 'react';

class FoodAnalytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null
    }
  }

  callOverallAnalyticalResultsAPI() {
    fetch("http://localhost:4000/foodAnalytics?reviewName=reviews_01")
      .then(res => res.text())
      .then(res => {
        this.setState(
          { apiResponse: JSON.parse(res) }
        );
        console.log(`asasa ${this.state.apiResponse}`)
      })
      .catch(err => console.log(`${err}`))
  }

  componentDidMount() {
    this.callOverallAnalyticalResultsAPI();
  }

  showData() {
    const displayResult = [];
    this.state.apiResponse.forEach(response => {
      displayResult.push(
        <div>
          <h1>Food Item: {response.foodItem}</h1>
          <h1>Total Number of Reviews: {response.totalNumberOfReviews}</h1>

          <h2>Positive Review Count: {response.positiveReviewCount}</h2>
          <h2>Positive Review Score: {response.positiveScore}</h2>

          <h2>Negative Review Count: {response.negativeReviewCount}</h2>
          <h2>Negative Review Score: {response.negativeScore}</h2>

          <h2>Neutral Review Count: {response.neutralReviewCount}</h2>
          <h2>Neutral Review Score: {response.neutralScore}</h2>

          <h2>Mixed Review Count: {response.mixedReviewCount}</h2>
          <h2>Mixed Review Score: {response.mixedScore}</h2>
        </div>
      );
    });
    return displayResult;
  }

  render() {
    if (!this.state.apiResponse) {
      return <h1>Data Still Loading....</h1>;
    } else {
      return(
        this.showData()
      );
    }
  }

}

export default FoodAnalytics;
