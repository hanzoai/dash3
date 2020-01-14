import { action, observable, computed, autorun, runInAction } from "mobx"

import akasha from 'akasha'
import { renderDate, rfc3339 } from '@hanzo/utils'

import capitalize from '../src/string/capitalize'

export default class ProductsStore {
  @observable query = undefined
  @observable searchTokens = {}
  @observable page = 1
  @observable display = 10
  @observable total = 0
  @observable products = []
  @observable triggerNewSearch = false
  @observable sort = undefined

  @observable productId = undefined
  @observable product = {}
  @observable errors = {}

  @observable isLoading = false

  constructor(data, hanzoApi) {
    this.api = hanzoApi
  }

  @action async getProduct(id) {
    this.isLoading = true

    this.productId = id || this.productId

    try {
      let res = await this.api.client.product.get(this.productId)

      runInAction(() => {
        this.product = Object.assign(this.product, res)
        // fix gender upper/lower case issues
        if (this.product.kyc && this.product.kyc.gender) {
          this.product.kyc.gender = this.product.kyc.gender.toLowerCase()
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

  @action async updateProduct() {
    this.isLoading = true

    try {
      let res = await this.api.client.product.update(this.product)

      runInAction(() => {
        this.product = res
        this.isLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }
  }

  @action async createProduct() {
    this.isLoading = true

    try {
      let res = await this.api.client.product.create(this.product)

      runInAction(() => {
        this.product = res
        this.isLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }
  }

  @action async listProducts(page, display, query) {
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

    this.countries   = akasha.get('library.countries') || []
    this.lastChecked = renderDate(new Date(), rfc3339)

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

      let res = await this.api.client.product.list(opts)

      runInAction(() => {
        this.products = res.models
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
      models:  this.products,
      page:    this.page,
      display: this.display,
      count:   this.count,
    }
  }
}
