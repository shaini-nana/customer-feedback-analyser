import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import Budget from 'src/components/dashboard//Budget';
import TotalCustomers from 'src/components/dashboard//TotalCustomers';

import {
  green,
  red,
  purple,
  orange
} from '@material-ui/core/colors';

// eslint-disable-next-line react/prefer-stateless-function
class FoodAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null
    };
  }

  componentDidMount() {
    this.callOverallAnalyticalResultsAPI();
  }

  callOverallAnalyticalResultsAPI() {
    fetch('http://localhost:4000/foodAnalytics?reviewName=reviews_01')
      .then((res) => res.text())
      .then((res) => {
        this.setState(
          { apiResponse: JSON.parse(res) }
        );
        console.log(`${JSON.stringify(this.state.apiResponse)}`);
      })
      .catch((err) => console.log(`${err}`));
  }

  displayFoodAnalytics() {
    const displayedResult = [];
    this.state.apiResponse.forEach((foodItemAnalytics) => {
      displayedResult.push(
        <Container maxWidth={false} padd>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalCustomers
                totalNumberOfReviews={
                  foodItemAnalytics.totalNumberOfReviews || 0
                }
                cardTitle="Number Of Customer Reviews"
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
            </Grid>

            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.positiveReviewCount || 0
                }
                cardTitle="Positive Review Count"
                colour={green[600]}
                isScore={false}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.negativeReviewCount || 0
                }
                cardTitle="Negative Review Count"
                colour={red[600]}
                isScore={false}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.neutralReviewCount || 0
                }
                cardTitle="Neutral Review Count"
                colour={orange[600]}
                isScore={false}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.mixedReviewCount || 0
                }
                cardTitle="Mixed Review Count"
                colour={purple[600]}
                isScore={false}
              />
            </Grid>

            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.positiveScore || 0
                }
                cardTitle="Positive Review Score"
                colour={green[600]}
                isScore={true}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.negativeScore || 0
                }
                cardTitle="Negative Review Score"
                colour={red[600]}
                isScore={true}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.neutralScore || 0
                }
                cardTitle="Neutral Review Score"
                colour={orange[600]}
                isScore={true}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget
                score={
                  foodItemAnalytics.mixedScore || 0
                }
                cardTitle="Mixed Review Score"
                colour={purple[600]}
                isScore={true}
              />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
            </Grid>
          </Grid>
        </Container>
      );
    });
    return displayedResult;
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Food Analytics</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          { this.state.apiResponse ? this.displayFoodAnalytics() : null }
        </Box>
      </>
    );
  }
}

export default FoodAnalytics;
