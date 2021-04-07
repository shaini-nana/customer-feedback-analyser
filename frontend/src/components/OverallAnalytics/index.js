import React, { Component } from 'react';

class OverallAnalytics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null
    }
  }

  callOverallAnalyticalResultsAPI() {
    fetch("http://localhost:4000/overallAnalytics?reviewName=reviews_01")
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

  render() {
    if (!this.state.apiResponse) {
      return <h1>Data Still Loading....</h1>;
    } else {
      return(
        <div>
          <h1>Total Number of Reviews: {this.state.apiResponse.totalNumberOfReviews}</h1>

          <h2>Positive Review Count: {this.state.apiResponse.positiveReviewCount}</h2>
          <h2>Positive Review Score: {this.state.apiResponse.positiveScore}</h2>

          <h2>Negative Review Count: {this.state.apiResponse.negativeReviewCount}</h2>
          <h2>Negative Review Score: {this.state.apiResponse.negativeScore}</h2>

          <h2>Neutral Review Count: {this.state.apiResponse.neutralReviewCount}</h2>
          <h2>Neutral Review Score: {this.state.apiResponse.neutralScore}</h2>

          <h2>Mixed Review Count: {this.state.apiResponse.mixedReviewCount}</h2>
          <h2>Mixed Review Score: {this.state.apiResponse.mixedScore}</h2>
        </div>
      );
    }
  }

}

export default OverallAnalytics;
