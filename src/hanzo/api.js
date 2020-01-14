import Hanzo from 'hanzo.js'
import blueprints from './blueprints'
import { action, observable, computed, autorun, runInAction } from "mobx"

export default class Api {
  @observable key = ''
  @observable endpoint = ''

  constructor(key, endpoint) {
    this.key = key
    this.endpoint = endpoint
  }

  @computed get client () {
    let client = new Hanzo.Api({ key: this.key, endpoint: this.endpoint })

    for (let k in blueprints) {
      let v = blueprints[k]
      client.addBlueprints(k, v)
    }

    return client
  }
}

