import { Component } from 'react'
import Router from 'next/router'
import { inject, observer } from 'mobx-react'

export default function (PageComponent) {
  @inject("store")
  @observer
  class LoggedInPage extends Component {
    constructor(props) {
      super(props)
    }

    componentDidMount() {
      const credentialStore = this.props.store.credentialStore
      if (!credentialStore.isLoggedIn) {
        Router.push('/')
        return
      }

      if (!credentialStore.org) {
        credentialStore.getOrg()
          .then(() => {
            console.log('still logged in')
          }).catch((e) => {
            console.log('not logged in, logging out')

            credentialStore.logout()
            Router.push('/')
          })
      }
    }

    render() {
      return pug`PageComponent(...this.props)`
    }
  }

  return LoggedInPage
}
