import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core'

import {
  blue,
  indigo,
} from '@material-ui/core/colors'

import {
  ArrowDropDown as ArrowDropDownIcon,
} from '@material-ui/icons'

import { makeStyles } from '@material-ui/styles'

import { observer } from 'mobx-react'

import moment from 'moment-timezone'

import React from 'react'

import { Bar } from 'react-chartjs-2'

import { useStore } from '../../../../stores'

import options from './config'

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative',
  },
  actions: {
    justifyContent: 'flex-end',
  },
}))

const TotalSales = observer((props) => {
  const classes = useStyles()

  const {
    credentialStore,
    dashboardStore,
  } = useStore()

  const currency = credentialStore.org ? credentialStore.org.currency : ''

  const {
    weeklyDates,
    weeklyRevenuePoints,
    lastWeeklyRevenuePoints,
  } = dashboardStore

  const data = {
    labels: weeklyDates.slice().map((d) => moment(d).format('D MMM')),
    datasets: [
      {
        label: 'Last Week',
        backgroundColor: indigo[500],
        data: lastWeeklyRevenuePoints.slice(),
      },
      {
        label: 'This Week',
        backgroundColor: blue[500],
        data: weeklyRevenuePoints.slice(),
      },
    ],
  }

  return (
    <Card
      {...props}
      className={classes.root}
    >
      <CardHeader
        action={
          <Button
            size='small'
            variant='text'
          >
            Last 7 days <ArrowDropDownIcon />
          </Button>
        }
        title='Latest Sales'
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar
            data={data}
            options={options(currency)}
          />
        </div>
      </CardContent>
    </Card>
  )
})

export default TotalSales
