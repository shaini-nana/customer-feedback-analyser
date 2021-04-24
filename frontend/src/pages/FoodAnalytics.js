import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box, Card, CardContent, CardHeader, Checkbox,
  Container, Divider, FormControlLabel,
  Grid
} from '@material-ui/core';
import Budget from 'src/components/dashboard//Budget';
import TotalCustomers from 'src/components/dashboard//TotalCustomers';

import {
  green,
  red,
  orange
} from '@material-ui/core/colors';
import { startCase, toLower, size } from 'lodash';

// eslint-disable-next-line react/prefer-stateless-function
class FoodAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null,
      selectedReviewsFile: 'mcdonalds'
    };
  }

  componentDidMount() {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/foodAnalytics?reviewName=${this.state.selectedReviewsFile}&isAdvance=false`);
  }

  handleSubmit = (event) => {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/foodAnalytics?reviewName=${this.state.selectedReviewsFile}&isAdvance=${event.target.checked}`);
  };

  getBestPerformingItem() {
    const items = this.state.apiResponse;
    let bestItem = {};
    for (let index = 0; index < size(items); index++) {
      if (index === 0) {
        bestItem = items[index];
      } else if ((items[index].positiveReviewCount / items[index].totalNumberOfReviews) > (bestItem.positiveReviewCount / bestItem.totalNumberOfReviews)) {
        bestItem = items[index];
      }
    }

    return (
      <Container maxWidth={false}>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
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
              <Budget
                score={
                  this.state.apiResponse ? this.state.apiResponse.mixedReviewCount : 0
                }
                totalScore={
                  this.state.apiResponse ? this.state.apiResponse.totalNumberOfReviews : 0
                }
                cardTitle="Best Performing Item:"
                colour={green[600]}
                isTrend={true}
                trend={startCase(toLower(bestItem.foodItem))}
              />
            </Grid>

          </Grid>
        </Box>
      </Container>
    );
  }

  getWorstPerformingItem() {
    const items = this.state.apiResponse;
    let worstItem = {};
    for (let index = 0; index < size(items); index++) {
      if (index === 0) {
        worstItem = items[index];
      } else if ((items[index].negativeReviewCount / items[index].totalNumberOfReviews) > (worstItem.negativeReviewCount / worstItem.totalNumberOfReviews)) {
        worstItem = items[index];
      }
    }

    return (
      <Container maxWidth={false}>
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
            <Budget
              score={
                this.state.apiResponse ? this.state.apiResponse.mixedReviewCount : 0
              }
              totalScore={
                this.state.apiResponse ? this.state.apiResponse.totalNumberOfReviews : 0
              }
              cardTitle="Worst Performing Item:"
              colour={red[600]}
              isTrend={true}
              trend={startCase(toLower(worstItem.foodItem))}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  callOverallAnalyticalResultsAPI(url) {
    fetch(url)
      .then((res) => res.text())
      .then((res) => {
        this.setState(
          { apiResponse: JSON.parse(res) }
        );
      })
      .catch((err) => console.log(`${err}`));
  }

  displayFoodAnalytics() {
    const displayedResult = [];
    this.state.apiResponse.forEach((foodItemAnalytics) => {
      displayedResult.push(
        <Container maxWidth={false}>

          <Card>
            <CardHeader
              subheader={`${startCase(toLower(foodItemAnalytics.foodItem))} related text based customer reviews`}
              title={startCase(toLower(foodItemAnalytics.foodItem))}
            />
          </Card>
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
                  foodItemAnalytics.mixedReviewCount || 0
                }
                cardTitle="Mixed Review Count"
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
            />

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
                totalScore={
                  foodItemAnalytics.totalNumberOfReviews || 0
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
                  foodItemAnalytics.negativeReviewCount || 0
                }
                totalScore={
                  foodItemAnalytics.totalNumberOfReviews || 0
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
                  foodItemAnalytics.mixedReviewCount || 0
                }
                totalScore={
                  foodItemAnalytics.totalNumberOfReviews || 0
                }
                cardTitle="Mixed Review Score"
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
            />
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
            py: 3
          }}
        >
          <Container maxWidth={false}>
            <Card>
              <CardHeader
                subheader="On all text based customer reviews"
                title={`Detail Food Item Analytics For: ${startCase(toLower(this.state.selectedReviewsFile))}`}
              />
              <Divider />
              <CardContent>
                <Grid
                  container
                  spacing={6}
                  wrap="wrap"
                >
                  <Grid
                    item
                    md={4}
                    sm={6}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    xs={12}
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          color="primary"
                          id="bb"
                          onChange={(event) => this.handleSubmit(event)}
                        />
                      )}
                      label="Apply Advanced Data Preprocessing"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Container>

        </Box>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
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
          </Grid>
          { this.state.apiResponse ? this.getBestPerformingItem() : null }
          { this.state.apiResponse ? this.getWorstPerformingItem() : null }
          { this.state.apiResponse ? this.displayFoodAnalytics() : null }
        </Box>
      </>
    );
  }
}

export default FoodAnalytics;
