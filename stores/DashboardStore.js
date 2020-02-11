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
  @observable weeklyDates = []

  @observable lastWeeklyDates = []

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

  @action async getWeeklySalesPoints() {
    this.isLoading = true

    this.weeklyDates = []
    for (let i = 0; i < 7; i++) {
      const now = moment().tz('America/Los_Angeles').endOf('day').subtract(i, 'day')
      this.weeklyDates.unshift(now)
    }

    try {
      const psWeekly = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeekly = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, 'week')),
          after: renderJSONDate(moment(n).subtract(1, 'week').subtract(1, 'day')),
        })
      ))

      const psWeeklyRefunded = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeeklyRefunded = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, 'week')),
          after: renderJSONDate(moment(n).subtract(1, 'week').subtract(1, 'day')),
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
      dates: this.weeklyDates,
      thisWeek: this.weeklySalesPoints,
      lastWeek: this.lastWeeklySalesPoints,
      thisWeekRefunded: this.weeklyRefundedPoints,
      lastWeekRefunded: this.lastWeeklyRefundedPoints,
    }
  }

  @action async getWeeklyRevenuePoints() {
    this.isLoading = true

    this.weeklyDates = []
    for (let i = 0; i < 7; i++) {
      const now = moment().tz('America/Los_Angeles').endOf('day').subtract(i, 'day')
      this.weeklyDates.unshift(now)
    }

    try {
      const psWeekly = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeekly = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, 'week')),
          after: renderJSONDate(moment(n).subtract(1, 'week').subtract(1, 'day')),
        })
      ))

      const psWeeklyRefunded = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(n),
          after: renderJSONDate(moment(n).subtract(1, 'day')),
        })
      ))

      const psLastWeeklyRefunded = this.weeklyDates.map((n) => (
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment(n).subtract(1, 'week')),
          after: renderJSONDate(moment(n).subtract(1, 'week').subtract(1, 'day')),
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
      dates: this.weeklyDates,
      thisWeek: this.weeklyRevenuePoints,
      lastWeek: this.lastWeeklyRevenuePoints,
      thisWeekRefunded: this.weeklyRefundedAmountPoints,
      lastWeekRefunded: this.lastWeeklyRefundedAmountPoints,
    }
  }

  @action async getWeeklySales() {
    this.isLoading = true

    const now = moment().tz('America/Los_Angeles').endOf('day')
    const lastWeek = moment()
      .endOf('day')
      .tz('America/Los_Angeles')
      // .subtract(1, 'week')

    try {
      const [weeklySales, lastWeeklySales, weeklyRefunds, lastWeeklyRefunds] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, 'week')),
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
    const lastWeek = moment()
      .endOf('day')
      .tz('America/Los_Angeles')
      .subtract(1, 'week')

    try {
      const [weeklyRevenue, lastWeeklyRevenue, weeklyRefundedAmount, lastWeeklyRefundedAmount] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, 'week')),
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
    const lastWeek = moment()
      .endOf('day')
      .tz('America/Los_Angeles')
      .subtract(1, 'week')

    try {
      const [weeklyUsers, lastWeeklyUsers] = await Promise.all([
        this.api.client.counter.search({
          tag: 'user.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(now),
          after: renderJSONDate(moment(now).subtract(1, 'week')),
        }),
        this.api.client.counter.search({
          tag: 'user.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(lastWeek),
          after: renderJSONDate(moment(lastWeek).subtract(1, 'week')),
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

    try {
      const [res, res2] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.count',
          period: 'hourly',
          geo: '',
          before: renderJSONDate(moment('2020-1-7')),
          after: renderJSONDate(moment('2020-2-7')),
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.count',
          period: 'total',
          geo: '',
        }),
      ])

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

    try {
      const [res, res2] = await Promise.all([
        this.api.client.counter.search({
          tag: 'order.revenue',
          period: 'total',
          geo: '',
        }),
        this.api.client.counter.search({
          tag: 'order.refunded.amount',
          period: 'total',
          geo: '',
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
