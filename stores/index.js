import { useLocalStore, useStaticRendering } from 'mobx-react'
import React from 'react'

// Proprietary Libraries
import Api from '../src/hanzo/api'

// Constants
import { HANZO_ENDPOINT } from '../src/settings'

// Stores
import CredentialStore from './CredentialStore'
import ProductsStore from './ProductsStore'
import SettingsStore from './SettingsStore'
import UsersStore from './UsersStore'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

let store = null

const defaultData = {
  credentialData: {},
  settingsData: {},
  userData: {},
  productData: {},
}

export const initStore = (data = defaultData) => {
  const api = new Api('', HANZO_ENDPOINT)

  if (isServer) {
    // Server stuff
    store = {
      credentialStore: new CredentialStore(data.credentialData, api),
      settingsStore: new SettingsStore(data.settingsData, api),
      usersStore: new UsersStore(data.userData, api),
      productsStore: new ProductsStore(data.productData, api),
    }
  } else if (!store) {
    // Client stuff
    store = {
      credentialStore: new CredentialStore(data.credentialData, api),
      settingsStore: new SettingsStore(data.settingsData, api),
      usersStore: new UsersStore(data.userData, api),
      productsStore: new ProductsStore(data.productData, api),
    }
  }

  // Otherwise we don't need to re-initialize the store
  return store
}

const storeContext = React.createContext(null)

export const StoreProvider = ({ children }) => {
  const s = useLocalStore(initStore)
  return <storeContext.Provider value={s}>{children}</storeContext.Provider>
}

export const useStore = () => {
  const s = React.useContext(storeContext)
  if (!s) {
    // this is especially useful in TypeScript so you don't need to
    // be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
}
