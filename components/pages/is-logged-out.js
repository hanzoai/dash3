import React from 'react'
import Router from 'next/router'
import { inject, observer } from 'mobx-react'

export default function (PageComponent) {
  @inject("store")
  @observer
  class LoggedOutPage extends React.Component {
    constructor(props) {
      super(props)
    }

    componentDidMount() {
      const credentialStore = this.props.store.credentialStore
      if (credentialStore.isLoggedIn) {
        Router.push('/dash')
      }
    }

    render() {
      return pug`PageComponent(...this.props)`
    }
  }

  return LoggedOutPage
}
