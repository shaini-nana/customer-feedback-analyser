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

const roundOffValueIfScore = (isScore, value) => {
  if (isScore) {
    return Math.round(value * 100) / 100;
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
            {roundOffValueIfScore(props.isScore, props.score)}
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
  cardTitle: PropTypes.string,
  colour: PropTypes.string,
  isScore: PropTypes.bool
};

export default Budget;
