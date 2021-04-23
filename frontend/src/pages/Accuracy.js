import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box, Card, CardContent, CardHeader, Checkbox,
  Container, Divider, FormControlLabel,
  Grid
} from '@material-ui/core';
import Budget from 'src/components/dashboard//Budget';

import {
  green,
  purple,
  orange,
  red,
  blue
} from '@material-ui/core/colors';
import { startCase, toLower } from 'lodash';

// eslint-disable-next-line react/prefer-stateless-function
class Accuracy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null,
      selectedReviewsFile: 'mcdonalds'
    };
  }

  componentDidMount() {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/accuracy?reviewName=${this.state.selectedReviewsFile}&isAdvance=false`);
  }

  handleSubmit = (event) => {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/accuracy?reviewName=${this.state.selectedReviewsFile}&isAdvance=${event.target.checked}`);
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

  displayClassificationScores() {
    const displayedResult = [];
    this.state.apiResponse.classificationScores.forEach((accuracyValues) => {
      displayedResult.push(
        <Container maxWidth={false}>

          <Card>
            <CardHeader
              subheader={accuracyValues.type}
              title="F1 / Precision / Recall Scores Calculation Mode:"
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
              <Budget
                score={
                  accuracyValues.f1 || 0
                }
                cardTitle="F1 Score"
                colour={green[600]}
                isScore={false}
                isAnalytics={true}
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
                  accuracyValues.precision || 0
                }
                cardTitle="Precision"
                colour={purple[600]}
                isScore={false}
                isAnalytics={true}
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
                  accuracyValues.recall || 0
                }
                cardTitle="Recall"
                colour={orange[600]}
                isScore={false}
                isAnalytics={true}
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

  displayOverallAccuracies() {
    return (
      <Container maxWidth={false}>

        <Card>
          <CardHeader
            subheader="Actual Statistics"
            title="Review Counts:"
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
            <Budget
              score={
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.totalCounts.count : 0
              }
              cardTitle="Total Number of Reviews"
              colour={blue[600]}
              isScore={false}
              isAnalytics={true}
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
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.totalCounts.positiveCount : 0
              }
              cardTitle="Total Number of Positive Reviews"
              colour={green[600]}
              isScore={false}
              isAnalytics={true}
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
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.totalCounts.negativeCount : 0
              }
              cardTitle="Total Number of Negative Reviews"
              colour={red[600]}
              isScore={false}
              isAnalytics={true}
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
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.totalCounts.mixedCount : 0
              }
              cardTitle="Total Number of Mixed Reviews"
              colour={orange[600]}
              isScore={false}
              isAnalytics={true}
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
  }

  displayPredictionAccuracies() {
    return (
      <Container maxWidth={false}>

        <Card>
          <CardHeader
            subheader="Successful Prediction Statistics"
            title="Correct Predictions:"
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
            <Budget
              score={
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.correctCounts.count : 0
              }
              totalScore={
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.totalCounts.count : 0
              }
              cardTitle="Total Correct Classifications"
              colour={blue[600]}
              isScore={false}
              isAnalytics={true}
              isAnalyticPercentages={true}
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
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.correctCounts.positiveCount : 0
              }
              cardTitle="Correct Positive Classifications"
              colour={green[600]}
              isScore={false}
              isAnalytics={true}
              isAnalyticPercentages={false}
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
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.correctCounts.negativeCount : 0
              }
              cardTitle="Correct Negative Classifications"
              colour={red[600]}
              isScore={false}
              isAnalytics={true}
              isAnalyticPercentages={false}
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
                this.state.apiResponse ? this.state.apiResponse.overallAccuracyValue.correctCounts.mixedCount : 0
              }
              cardTitle="Correct Mixed Classifications"
              colour={orange[600]}
              isScore={false}
              isAnalytics={true}
              isAnalyticPercentages={false}
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
                title={`Overall Accuracies For: ${startCase(toLower(this.state.selectedReviewsFile))}`}
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
                      label="With Advanced Data Preprocessing"
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

          { this.state.apiResponse ? this.displayClassificationScores() : null }
          { this.state.apiResponse ? this.displayOverallAccuracies() : null }
          { this.state.apiResponse ? this.displayPredictionAccuracies() : null }

        </Box>
      </>
    );
  }
}
export default Accuracy;
