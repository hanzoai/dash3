import {
  MUIKeyboardDatePicker
} from '@hanzo/react'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useStore } from '../../../stores'

import {
  DailyRevenue,
  ProductPerformance,
  SalesChart,
  TotalRevenue,
  TotalSales,
  TotalUsers,
} from './charts'

const Dashboard = observer(() => {
  const {
    credentialStore,
    dashboardStore,
  } = useStore()

  // Refresh Stats
  useEffect(() => {
    dashboardStore.getWeeklySalesPoints()
    dashboardStore.getWeeklyRevenuePoints()

    dashboardStore.getWeeklySales()
    dashboardStore.getWeeklyRevenue()
    dashboardStore.getWeeklyUsers()

    dashboardStore.getTotalSales()
    dashboardStore.getTotalRevenue()
    dashboardStore.getTotalUsers()

    dashboardStore.getProducts()
  }, [])

  return (
    <Grid container justify='center' alignItems='flex-start' spacing={2}>
      <Grid
        item
        lg={3}
        sm={6}
        xl={3}
        xs={12}
      >
        <TotalRevenue />
      </Grid>
      <Grid
        item
        lg={3}
        sm={6}
        xl={3}
        xs={12}
      >
        <TotalSales />
      </Grid>
      <Grid
        item
        lg={3}
        sm={6}
        xl={3}
        xs={12}
      >
        <TotalUsers />
      </Grid>
      <Grid
        item
        lg={3}
        sm={6}
        xl={3}
        xs={12}
      >
        <DailyRevenue />
      </Grid>
      <Grid item xs={12}>
        <SalesChart />
      </Grid>
      <Grid item xs={12}>
        <ProductPerformance />
      </Grid>
    </Grid>
  )
})

export default Dashboard
