import { useStaticRendering } from 'mobx-react'

// Proprietary Libraries
import Api from '../src/hanzo/api'

// Stores
import CredentialStore from './CredentialStore'
import SettingsStore   from './SettingsStore'
import UsersStore      from './UsersStore'
import ProductsStore   from './ProductsStore'

// Constants
import { HANZO_ENDPOINT } from '../src/settings'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

let store = null

const defaultData = {
  credentialData: {},
  settingsData:   {},
  userData:       {},
  productData:    {},
}

const initStore = (data = defaultData) => {
  let credentialStore
  const api = new Api('', HANZO_ENDPOINT)

  if (isServer) {
    // Server stuff
    store = {
      credentialStore: new CredentialStore(data.credentialData, api),
      settingsStore:   new SettingsStore(data.settingsData, api),
      usersStore:      new UsersStore(data.userData, api),
      productsStore:   new ProductsStore(data.productData, api),
    }
  } else if (!store) {
    // Client stuff
    store = {
      credentialStore: new CredentialStore(data.credentialData, api),
      settingsStore:   new SettingsStore(data.settingsData, api),
      usersStore:      new UsersStore(data.userData, api),
      productsStore:   new ProductsStore(data.productData, api),
    }
  }

  credentialStore = store.credentialStore

  // Otherwise we don't need to re-initialize the store
  return store
}

export default initStore
