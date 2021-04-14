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
  orange
} from '@material-ui/core/colors';

// eslint-disable-next-line react/prefer-stateless-function
class Accuracy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null
    };
  }

  componentDidMount() {
    this.callOverallAnalyticalResultsAPI('http://localhost:4000/accuracy?reviewName=reviews_01&isAdvance=false');
  }

  handleSubmit = (event) => {
    this.callOverallAnalyticalResultsAPI(`http://localhost:4000/accuracy?reviewName=reviews_01&isAdvance=${event.target.checked}`);
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

  displayFoodAnalytics() {
    const displayedResult = [];
    this.state.apiResponse.forEach((accuracyValues) => {
      displayedResult.push(
        <Container maxWidth={false}>

          <Card>
            <CardHeader
              subheader={accuracyValues.type}
              title="F1 Score Calculation Mode:"
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
                title="Overall Accuracies"
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

          { this.state.apiResponse ? this.displayFoodAnalytics() : null }
        </Box>
      </>
    );
  }
}

export default Accuracy;
