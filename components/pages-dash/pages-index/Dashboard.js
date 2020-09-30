import {
  Grid,
} from '@material-ui/core'
import {
  PaymentOutlined,
  ShoppingCartOutlined,
  Receipt,
} from '@material-ui/icons'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useStore } from '../../../stores'

import {
  ProductPerformance,
  SalesChart,
  SmallDashChart,
} from './charts'

const Dashboard = observer(() => {
  const {
    dashboardStore,
  } = useStore()

  // Refresh Stats
  useEffect(() => {
    dashboardStore.getWeeklySalesPoints()
    dashboardStore.getWeeklyRevenuePoints()

    dashboardStore.getWeeklySales()
    dashboardStore.getWeeklyRevenue()
    dashboardStore.getWeeklyUsers()

    // dashboardStore.getTotalSales()
    // dashboardStore.getTotalRevenue()
    // dashboardStore.getTotalUsers()

    dashboardStore.getProducts()

    dashboardStore.getProjectedRevenue()
    dashboardStore.getDeposits()
    dashboardStore.getRefunds()
  }, [])

  const {
    deposits,
    refunds,
    weeklySales,
    weeklyRefunded,
    lastWeeklySales,
    lastWeeklyRefunded,
    lastDeposits,
    lastRefunds,
    projectedRevenue,
    lastProjectedRevenue,
    depositsSelect,
    refundsSelect,
    salesSelect,
    projectedRevenueSelect,
  } = dashboardStore

  return (
    <Grid container justify='center' alignItems='flex-start' spacing={2}>
      <Grid
        item
        lg={2}
        sm={6}
        xl={3}
        xs={12}
      >
        <SmallDashChart
          cardProps={{}}
          displayValue={projectedRevenue}
          title='Projected Revenue'
          queryField='projectedRevenue'
          IconComponent={PaymentOutlined}
          useCurrency
          compareValue={projectedRevenue}
          previousValue={lastProjectedRevenue}
          timeSelectValue={projectedRevenueSelect}
        />
      </Grid>
      <Grid
        item
        lg={2}
        sm={6}
        xl={3}
        xs={12}
      >
        <SmallDashChart
          displayValue={weeklySales - weeklyRefunded}
          title='Active Preorders'
          queryField='sales'
          IconComponent={ShoppingCartOutlined}
          compareValue={weeklySales - weeklyRefunded}
          previousValue={lastWeeklySales - lastWeeklyRefunded}
          timeSelectValue={salesSelect}
        />
      </Grid>
      <Grid
        item
        lg={2}
        sm={6}
        xl={3}
        xs={12}
      >
        <SmallDashChart
          displayValue={deposits}
          title='Deposits'
          queryField='deposits'
          useCurrency
          IconComponent={PaymentOutlined}
          compareValue={deposits}
          previousValue={lastDeposits}
          timeSelectValue={depositsSelect}
        />
      </Grid>
      <Grid
        item
        lg={2}
        sm={6}
        xl={3}
        xs={12}
      >
        <SmallDashChart
          displayValue={weeklySales}
          title='Deposits Processed'
          queryField='deposits'
          IconComponent={PaymentOutlined}
          compareValue={weeklySales}
          previousValue={lastWeeklySales}
          timeSelectValue={salesSelect}
        />
      </Grid>
      <Grid
        item
        lg={2}
        sm={6}
        xl={3}
        xs={12}
      >
        <SmallDashChart
          displayValue={refunds}
          title='Refunds'
          queryField='refunds'
          IconComponent={Receipt}
          useCurrency
          compareValue={refunds}
          previousValue={lastRefunds}
          timeSelectValue={refundsSelect}
        />
      </Grid>
      <Grid
        item
        lg={2}
        sm={6}
        xl={3}
        xs={12}
      >
        <SmallDashChart
          displayValue={weeklyRefunded}
          title='Refunds Processed'
          queryField='sales'
          IconComponent={Receipt}
          compareValue={weeklyRefunded}
          previousValue={lastWeeklyRefunded}
          timeSelectValue={salesSelect}
        />
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
