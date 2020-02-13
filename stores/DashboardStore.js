import {
  renderJSONDate,
} from '@hanzo/utils'

import {
  action,
  observable,
  runInAction,
} from 'mobx'

import moment from 'moment-timezone'

export default class DashboardStore {
  @observable orgStart = null

  @observable revSelect = 0
  @observable revPeriod = 'week'
  @observable revDate = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'week')
  
  @observable chartSelect = 0
  @observable chartPeriod = 'week'
  @observable chartDate = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'week')
  @observable chartDates = []
  
  @observable salesSelect = 0
  @observable salesPeriod = 'week'
  @observable salesDate = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'week')
  
  @observable usersSelect = 0
  @observable usersPeriod = 'week'
  @observable usersDate = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'week')

  @observable weeklyDates = []

  @observable weeklySalesPoints = []

  @observable lastWeeklySalesPoints = []

  @observable weeklyRefundedPoints = []

  @observable lastWeeklyRefundedPoints = []

  @observable weeklyRevenuePoints = []

  @observable lastWeeklyRevenuePoints = []

  @observable weeklyRefundedAmountPoints = []

  @observable lastWeeklyRefundedAmountPoints = []

  @observable weeklySales = 0

  @observable lastWeeklySales = 0

  @observable weeklyRefunded = 0

  @observable lastWeeklyRefunded = 0

  @observable weeklyRevenue = 0

  @observable lastWeeklyRevenue = 0

  @observable weeklyRefundedAmount = 0

  @observable lastWeeklyRefundedAmount = 0

  @observable weeklyUsers = 0

  @observable lastWeeklyUsers = 0

  @observable totalSales = 0

  @observable totalRefunded = 0

  @observable totalRevenue = 0

  @observable totalRefundedAmount = 0

  @observable totalUsers = 0

  @observable products = []

  @observable errors = {}

  @observable isLoading = false

  constructor(data, hanzoApi) {
    this.api = hanzoApi
  }

  @action setOrgDate(org) {
    console.log('set org', org && org.createdAt)
    this.orgStart = org ? moment(org.createdAt) : moment()
  }

  @action setDate(field, val, custom) {
    let d = null
    let period = ''
    switch (val) {
      case 0:
        // Last 7 days
        d = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'week')
        period = 'week'
        break
      case 1:
        // Last day
        d = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'day')
        period = 'day'
        break
      case 2:
        // This Month
        d = moment().tz('America/Los_Angeles').startOf('month')
        period = 'month'
        break
      case 3:
        // Last 30 days
        d = moment().tz('America/Los_Angeles').endOf('day').subtract(30, 'day')
        period = 'month'
        break
      case 4:
        // All time
        d = moment(custom.date)
        period = custom.period
        break
      default:
        break
    }

    this[`${field}Select`] = val
    this[`${field}Period`] = period
    this[`${field}Date`] = d

    if (field === 'rev') {
      console.log('Refreshing revenue', d.format('MM-DD-YYYY'))
      this.chartSelect = val
      this.chartPeriod = period
      this.chartDate = d
      this.getWeeklyRevenuePoints()
      this.getWeeklyRevenue()
      this.getTotalRevenue()
    } else if (field === 'chart') {
      console.log('Refreshing sales chart', d.format('MM-DD-YYYY'))
      this.setChartPoints()
    } else if (field === 'users') {
      console.log('Refreshing users chart', d.format('MM-DD-YYYY'))
      this.getWeeklyUsers()
    } else if (field === 'sales') {
      console.log('Refreshing sales chart', d.format('MM-DD-YYYY'))
      this.getWeeklySalesPoints()
      this.getWeeklySales()
      this.getTotalSales()
    }
  }

  @action async getWeeklySalesPoints() {
    this.isLoading = true

    // this.weeklyDates = []
    // for (let i = 0; i < 7; i++) {
    //   const now = moment().tz('America/Los_Angeles').endOf('day').subtract(i, 'day')
    //   this.weeklyDates.unshift(now)
    // }

    let now = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'day')
    const chartDates = []
    while (now.isAfter(this.chartDate)) {
      chartDates.unshift(moment(now))
      now = now.subtract(1, 'day')
    }
    chartDates.unshift(moment(now).subtract(1, 'day'))
    this.chartDates = chartDates

    try {
      const psWeekly = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeekly = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, this.chartPeriod)),
          after: renderJSONDate(moment(n).subtract(1, this.chartPeriod).subtract(1, 'day')),
        })
      ))

      const psWeeklyRefunded = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeeklyRefunded = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, this.chartPeriod)),
          after: renderJSONDate(moment(n).subtract(1, this.chartPeriod).subtract(1, 'day')),
        })
      ))

      const weeklySalesPoints = await Promise.all(psWeekly)
      const lastWeeklySalesPoints = await Promise.all(psLastWeekly)
      const weeklyRefundedPoints = await Promise.all(psWeeklyRefunded)
      const lastWeeklyRefundedPoints = await Promise.all(psLastWeeklyRefunded)

      runInAction(() => {
        this.weeklySalesPoints = weeklySalesPoints.map((p) => p.count)
        this.lastWeeklySalesPoints = lastWeeklySalesPoints.map((p) => p.count)
        this.weeklyRefundedPoints = weeklyRefundedPoints.map((p) => p.count)
        this.lastWeeklyRefundedPoints = lastWeeklyRefundedPoints.map((p) => p.count)
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return {
      dates: this.chartDates,
      thisWeek: this.weeklySalesPoints,
      lastWeek: this.lastWeeklySalesPoints,
      thisWeekRefunded: this.weeklyRefundedPoints,
      lastWeekRefunded: this.lastWeeklyRefundedPoints,
    }
  }

  @action async getWeeklyRevenuePoints() {
    this.isLoading = true

    let now = moment().tz('America/Los_Angeles').endOf('day').subtract(1, 'day')
    const chartDates = []
    while (now.isAfter(this.chartDate)) {
      chartDates.unshift(moment(now))
      now = now.subtract(1, 'day')
    }
    chartDates.unshift(moment(now).subtract(1, 'day'))
    this.chartDates = chartDates

    try {
      const psWeekly = this.chartDates.map((n) => {
        return this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      })

      const psLastWeekly = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, this.revPeriod)),
          after: renderJSONDate(moment(n).subtract(1, this.revPeriod).subtract(1, 'day')),
        })
      ))

      const psWeeklyRefunded = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeeklyRefunded = this.chartDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, this.revPeriod)),
          after: renderJSONDate(moment(n).subtract(1, this.revPeriod).subtract(1, 'day')),
        })
      ))

      const weeklyRevenuePoints = await Promise.all(psWeekly)
      const lastWeeklyRevenuePoints = await Promise.all(psLastWeekly)
      const weeklyRefundedAmountPoints = await Promise.all(psWeeklyRefunded)
      const lastWeeklyRefundedAmountPoints = await Promise.all(psLastWeeklyRefunded)

      runInAction(() => {
        this.weeklyRevenuePoints = weeklyRevenuePoints.map((p) => p.count)
        this.lastWeeklyRevenuePoints = lastWeeklyRevenuePoints.map((p) => p.count)
        this.weeklyRefundedAmountPoints = weeklyRefundedAmountPoints.map((p) => p.count)
        this.lastWeeklyRefundedAmountPoints = lastWeeklyRefundedAmountPoints.map((p) => p.count)
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return {
      dates: this.chartDates,
      thisWeek: this.weeklyRevenuePoints,
      lastWeek: this.lastWeeklyRevenuePoints,
      thisWeekRefunded: this.weeklyRefundedAmountPoints,
      lastWeekRefunded: this.lastWeeklyRefundedAmountPoints,
    }
  }

  @action async getWeeklySales() {
    this.isLoading = true

    const now = moment().tz('America/Los_Angeles').endOf('day')
    const lastWeek = this.salesDate

    try {
      const [weeklySales, lastWeeklySales, weeklyRefunds, lastWeeklyRefunds] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, this.salesPeriod)),
        }),
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, this.salesPeriod)),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, this.salesPeriod)),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, this.salesPeriod)),
        }),
      ])

      runInAction(() => {
        this.weeklySales = weeklySales.count
        this.lastWeeklySales = lastWeeklySales.count
        this.weeklyRefunded = weeklyRefunds.count
        this.lastWeeklyRefunded = lastWeeklyRefunds.count
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return {
      thisWeek: this.weeklySales,
      lastWeek: this.lastWeeklySales,
      thisWeekRefunded: this.weeklyRefunded,
      lastWeekRefunded: this.lastWeeklyRefunded,
    }
  }

  @action async getWeeklyRevenue() {
    this.isLoading = true

    const now = moment().tz('America/Los_Angeles').endOf('day')
    const lastWeek = this.revDate

    try {
      const [weeklyRevenue, lastWeeklyRevenue, weeklyRefundedAmount, lastWeeklyRefundedAmount] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, this.revPeriod)),
        }),
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, this.revPeriod)),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, this.revPeriod)),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, this.revPeriod)),
        }),
      ])

      runInAction(() => {
        this.weeklyRevenue = weeklyRevenue.count
        this.lastWeeklyRevenue = lastWeeklyRevenue.count
        this.weeklyRefundedAmount = weeklyRefundedAmount.count
        this.lastWeeklyRefundedAmount = lastWeeklyRefundedAmount.count
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return {
      thisWeek: this.weeklyRevenue,
      lastWeek: this.lastWeeklyRevenue,
      thisWeekRefunded: this.weeklyRefundedAmount,
      lastWeekRefunded: this.lastWeeklyRefundedAmount,
    }
  }

  @action async getWeeklyUsers() {
    this.isLoading = true

    const now = moment().tz('America/Los_Angeles').endOf('day')
    const lastWeek = this.usersDate

    try {
      const [weeklyUsers, lastWeeklyUsers] = await Promise.all([
        this.api.client.counter.search({
          tag: 'user.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(lastWeek),
        }),
        this.api.client.counter.search({
          tag: 'user.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(lastWeek.subtract(1, this.usersPeriod)),
        }),
      ])

      runInAction(() => {
        this.weeklyUsers = weeklyUsers.count
        this.lastWeeklyUsers = lastWeeklyUsers.count
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return {
      thisWeek: this.weeklyUsers,
      lastWeek: this.lastWeeklyUsers,
    }
  }

  @action async getTotalSales() {
    this.isLoading = true
    const now = moment().tz('America/Los_Angeles').endOf('day')
    try {
      const [res, res2] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(this.salesDate),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'total',
          geo: '',
        }),
      ])

      console.log('sales', res, res2)

      runInAction(() => {
        this.totalSales = res.count
        this.totalRefunded = res2.count
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return this.totalSales
  }

  @action async getTotalRevenue() {
    this.isLoading = true
    const now = moment().tz('America/Los_Angeles').endOf('day')
    try {
      const [res, res2] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(this.revDate),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now.subtract(1, this.revPeriod)),
          after: renderJSONDate(this.revDate.subtract(1, this.revPeriod)),
        }),
      ])

      runInAction(() => {
        this.totalRevenue = res.count
        this.totalRefundedAmount = res2.count
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return this.totalRevenue
  }

  @action async getTotalUsers() {
    this.isLoading = true
    try {
      const res = await this.api.client.counter.search({
        tag: 'user.count',
        period: 'total',
        geo: '',
      })

      runInAction(() => {
        this.totalUsers = res.count
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    return this.totalUsers
  }

  @action async getProducts() {
    this.isLoading = true

    try {
      const opts = {
        page: 1,
        display: 100,
      }

      const res = await this.api.client.product.list(opts)

      runInAction(() => {
        this.products = res.models
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      console.log('list error', e)

      throw e
    }

    const ps = []
    for (const product of this.products) {
      ps.push(this.api.client.counter.search({
        tag: `product.${product.id}.sold`,
        period: 'total',
        geo: '',
      }))
    }

    const ps2 = []
    for (const product of this.products) {
      ps2.push(this.api.client.counter.search({
        tag: `product.${product.id}.revenue`,
        period: 'total',
        geo: '',
      }))
    }

    const ps3 = []
    for (const product of this.products) {
      ps3.push(this.api.client.counter.search({
        tag: `product.${product.id}.refunded.count`,
        period: 'total',
        geo: '',
      }))
    }

    try {
      const res = await Promise.all(ps)
      for (const k in this.products) {
        this.products[k].sold = res[k].count
      }
    } catch (e) {
      console.log('counter error', e)
      throw e
    }

    try {
      const res = await Promise.all(ps2)
      for (const k in this.products) {
        this.products[k].revenue = res[k].count
      }
    } catch (e) {
      console.log('counter error', e)
      throw e
    }

    try {
      const res = await Promise.all(ps3)
      for (const k in this.products) {
        this.products[k].refunded = res[k].count
      }
    } catch (e) {
      console.log('counter error', e)
      throw e
    }

    runInAction(() => {
      this.products = this.products.slice().sort((a, b) => b.sold - a.sold)
    })

    // console.log('p', this.products.slice())

    return this.products
  }
}
