import akasha from 'akasha'
import { renderDate, rfc3339 } from '@hanzo/utils'

import {
  action,
  autorun,
  computed,
  observable,
  runInAction,
} from 'mobx'

export default class SettingsStore {
  @observable lastChecked = undefined

  @observable countries = []

  @observable isLoading = false

  constructor(data, hanzoApi) {
    this.api = hanzoApi

    this.load()

    autorun(() => this.save())
  }

  save() {
    akasha.set('library.lastChecked', this.lastChecked)
    akasha.set('library.countries', this.countries)
  }

  @action async load() {
    this.isLoading = true
    this.countries = akasha.get('library.countries') || []
    this.lastChecked = renderDate(new Date(), rfc3339)

    try {
      const res = await this.api.client.library.daisho({
        hasCountries: !!this.countries && this.countries.length !== 0,
        lastChecked: renderDate(this.lastChecked || '2000-01-01', rfc3339),
      })

      runInAction(() => {
        this.countries = res.countries || this.countries

        this.save()
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })

      throw e
    }
  }

  get genderOptions() {
    return {
      male: 'Male',
      female: 'Female',
      unspecified: 'Unspecified',
      other: 'Other',
    }
  }

  @computed get countryOptions() {
    const countries = this.countries.slice().sort((a, b) => {
      if (a.name < b.name) { return -1 }
      if (a.name > b.name) { return 1 }
      return 0
    })

    const options = {}

    for (const k in countries) {
      const country = countries[k]
      options[country.code.toUpperCase()] = country.name
    }

    return options
  }

  @computed get stateOptions() {
    const options = {}
    const { countries } = this

    for (const k in countries) {
      const country = countries[k]
      const cCode = country.code.toUpperCase()

      let c = options[cCode]
      if (!c) {
        options[cCode] = {}
        c = options[cCode]
      }

      const subdivisions = country.subdivisions.slice().sort((a, b) => {
        if (a.name < b.name) { return -1 }
        if (a.name > b.name) { return 1 }
        return 0
      })

      for (const k2 in subdivisions) {
        const subdivision = subdivisions[k2]

        c[subdivision.code.toUpperCase()] = subdivision.name
      }
    }

    return options
  }
}
