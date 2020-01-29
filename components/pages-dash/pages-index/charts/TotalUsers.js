import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import PeopleIcon from '@material-ui/icons/PeopleOutlined'

import { makeStyles } from '@material-ui/styles'

import { observer } from 'mobx-react'

import React from 'react'

import { useStore } from '../../../../stores'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
  },
  title: {
    fontWeight: 700,
  },
  successAvatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56,
  },
  errorAvatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56,
  },
  icon: {
    height: 32,
    width: 32,
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  errorDifferenceIcon: {
    color: theme.palette.error.dark,
  },
  errorDifferenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1),
  },
  successDifferenceIcon: {
    color: theme.palette.success.dark,
  },
  successDifferenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1),
  },
}))

const TotalUsers = observer((props) => {
  const classes = useStyles()

  const {
    dashboardStore,
  } = useStore()

  const {
    weeklyUsers,
    lastWeeklyUsers,
  } = dashboardStore

  return (
    <Card
      {...props}
    >
      <CardContent>
        <Grid
          container
          justify='space-between'
        >
          <Grid item>
            <Typography
              className={classes.title}
              color='textSecondary'
              gutterBottom
              variant='body2'
            >
              TOTAL USERS
            </Typography>
            <Typography variant='h4'>{ dashboardStore.totalUsers }</Typography>
          </Grid>
          <Grid item>
            { weeklyUsers >= lastWeeklyUsers
              ? <Avatar className={classes.successAvatar}>
                  <PeopleIcon className={classes.icon} />
                </Avatar>
              : <Avatar className={classes.errorAvatar}>
                  <PeopleIcon className={classes.icon} />
                </Avatar>
            }
          </Grid>
        </Grid>
        <div className={classes.difference}>
          { weeklyUsers >= lastWeeklyUsers
            ? <>
              <ArrowUpwardIcon className={classes.successDifferenceIcon} />
              <Typography
                className={classes.successDifferenceValue}
                variant='body2'
              >
                {
                  lastWeeklyUsers
                    ? ((weeklyUsers / lastWeeklyUsers) * 100).toFixed(2)
                    : 100
                }%
              </Typography>
            </>
            : <>
              <ArrowDownwardIcon className={classes.errorDifferenceIcon} />
              <Typography
                className={classes.errorDifferenceValue}
                variant='body2'
              >
                { (-100 + (weeklyUsers / lastWeeklyUsers) * 100).toFixed(2) }%
              </Typography>
            </>
          }
          <Typography
            className={classes.caption}
            variant='caption'
          >
            Since last week
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
})

export default TotalUsers
