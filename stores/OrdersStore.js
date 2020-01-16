import { action, observable, computed, autorun, runInAction } from "mobx"

import akasha from 'akasha'
import { renderDate, rfc3339 } from '@hanzo/utils'

import capitalize from '../src/string/capitalize'

export default class OrdersStore {
  @observable query = undefined
  @observable searchTokens = {}
  @observable page = 1
  @observable display = 10
  @observable total = 0
  @observable orders = []
  @observable triggerNewSearch = false
  @observable sort = undefined

  @observable orderId = undefined
  @observable order = {}
  @observable errors = {}

  @observable isLoading = false

  constructor(data, hanzoApi) {
    this.api = hanzoApi
  }

  @action async getOrder(id) {
    this.isLoading = true

    this.orderId = id || this.orderId

    try {
      let res = await this.api.client.order.get(this.orderId)

      runInAction(() => {
        this.order = Object.assign(this.order, res)
        // fix gender upper/lower case issues
        if (this.order.kyc && this.order.kyc.gender) {
          this.order.kyc.gender = this.order.kyc.gender.toLowerCase()
        }
        this.isLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }
  }

  @action async updateOrder() {
    this.isLoading = true

    try {
      let res = await this.api.client.order.update(this.order)

      runInAction(() => {
        this.order = res
        this.isLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }
  }

  @action async createOrder() {
    this.isLoading = true

    try {
      let res = await this.api.client.order.create(this.order)

      runInAction(() => {
        this.order = res
        this.isLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }
  }

  @action async listOrders(page, display, query) {
    this.isLoading = true

    this.query   = query || this.query
    this.page    = page  || this.page
    this.display = display || this.display

    if (!this.query || !this.page || !this.display) {
      throw new Error('Some are parameters are missing')
    }

    if (query.orderBy) {
      this.sort = (query.orderDirection === 'asc' ? '-' : '') + capitalize(query.orderBy.field)
    }

    try {
      const opts = {
        page: this.page,
        display: this.display,
      }

      let q = []

      for (let k in this.searchTokens) {
        let v = this.searchTokens[k]

        // special case query string
        if (k === 'q') {
          if (v !== undefined && v !== '') {
            console.log(k, v)
            q.push(v)
          }
          continue
        }

        if (v) {
          q.push(`${k}:${v}`)
        }
      }

      if (q.length > 0) {
        opts.q = q.join(' AND ')
      }

      if (query.orderBy) {
        opts.sort = this.sort
      }

      console.log('opts', opts)

      let res = await this.api.client.order.list(opts)

      runInAction(() => {
        this.orders = res.models
        this.count = parseInt(res.count, 10)
        this.isLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }

    console.log('display', this.display)

    return {
      models:  this.orders,
      page:    this.page,
      display: this.display,
      count:   this.count,
    }
  }
}
