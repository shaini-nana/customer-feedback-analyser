import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  CardHeader,
  Container,
  Grid,
  Card,
  FormControlLabel,
  Checkbox,
  CardContent,
  Divider
} from '@material-ui/core';
import Budget from 'src/components/dashboard//Budget';
import TotalCustomers from 'src/components/dashboard//TotalCustomers';

import {
  green,
  red,
  orange
} from '@material-ui/core/colors';

// eslint-disable-next-line react/prefer-stateless-function
class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null,
      selectedReviewsFile: 'mcdonalds'
    };
  }

  componentDidMount() {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/overallAnalytics?reviewName=${this.state.selectedReviewsFile}&isAdvance=false`);
  }

  handleSubmit = (event) => {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/overallAnalytics?reviewName=${this.state.selectedReviewsFile}&isAdvance=${event.target.checked}`);
  };

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

  render() {
    return (
      <>
        <Helmet>
          <title>Overall Analytics</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            <Card>
              <CardHeader
                subheader="On all text based customer reviews"
                title="Overall Analytics"
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
                    this.state.apiResponse ? this.state.apiResponse.totalNumberOfReviews : 0
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
                    this.state.apiResponse ? this.state.apiResponse.positiveReviewCount : 0
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
                    this.state.apiResponse ? this.state.apiResponse.negativeReviewCount : 0
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
                    this.state.apiResponse ? this.state.apiResponse.mixedReviewCount : 0
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
                    this.state.apiResponse ? this.state.apiResponse.positiveReviewCount : 0
                  }
                  totalScore={
                    this.state.apiResponse ? this.state.apiResponse.totalNumberOfReviews : 0
                  }
                  cardTitle="Positive Review Percentage"
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
                    this.state.apiResponse ? this.state.apiResponse.negativeReviewCount : 0
                  }
                  totalScore={
                    this.state.apiResponse ? this.state.apiResponse.totalNumberOfReviews : 0
                  }
                  cardTitle="Negative Review Percentage"
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
                    this.state.apiResponse ? this.state.apiResponse.mixedReviewCount : 0
                  }
                  totalScore={
                    this.state.apiResponse ? this.state.apiResponse.totalNumberOfReviews : 0
                  }
                  cardTitle="Mixed Review Percentage"
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
            </Grid>
          </Container>
        </Box>
      </>
    );
  }
}

export default Analytics;
