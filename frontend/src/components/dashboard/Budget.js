import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import ScoreIcon from '@material-ui/icons/Score';
import AssessmentIcon from '@material-ui/icons/Assessment';

const populateIcon = (isScore) => {
  if (isScore) {
    return <ScoreIcon />;
  }
  return <AssessmentIcon />;
};

const roundOffValueIfScore = (isScore, value, total, isAnalytics, isAnalyticPercentages, isTrend, trend) => {
  if (isScore) {
    const score = Math.round((value / total) * 100 * 100) / 100;
    return `${score}%`;
  }
  if (isTrend) {
    return trend;
  }
  if (isAnalytics && isAnalyticPercentages) {
    const score = Math.round((value / total) * 100 * 100) / 100;
    return `${value} (${score}%)`;
  }
  if (isAnalytics) {
    const score = Math.round(value * 100) / 100;
    return `${score}`;
  }
  return value;
};

const Budget = (props) => (
  <Card
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            {props.cardTitle}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h1"
          >
            {roundOffValueIfScore(props.isScore, props.score, props.totalScore, props.isAnalytics, props.isAnalyticPercentages, props.isTrend, props.trend)}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: props.colour,
              height: 56,
              width: 56
            }}
          >
            {populateIcon(props.isScore)}
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

Budget.propTypes = {
  score: PropTypes.number,
  totalScore: PropTypes.number,
  cardTitle: PropTypes.string,
  colour: PropTypes.string,
  isScore: PropTypes.bool,
  isAnalytics: PropTypes.bool,
  isAnalyticPercentages: PropTypes.bool,
  isTrend: PropTypes.bool,
  trend: PropTypes.string,
};

export default Budget;
