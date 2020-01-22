import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'
import { UserForm } from '../../components/pages-dash'

import css from 'styled-jsx/css'

@isLoggedIn
@inject("store")
@observer
class User extends Component {
  constructor(props) {
    super(props)

    this.state = {
      create: false,
    }
  }

  componentDidMount() {
    // Check router and url
    let id = this.props.router.query.id

    if (!id && typeof window !== 'undefined') {
      let params = new URLSearchParams(window.location.search)
      id = params.get('id')
    }

    // if there is an id then start in normal mode
    if (id) {
      this.props.store.usersStore.getUser(id).catch((e) => {
        console.log('user page error', e)
        Router.push('/dash')
      })
    } else {
      this.setState({ create: true })
    }
  }

  render() {
    return <> {
      pug`
        main#dash.user
          UserForm(doCreate=this.state.create)
      `}
      <style jsx global>{`
        #dash.user
          padding-left: 200px
          padding-top: 80px
          width: 100vw

          & > *
            margin: 0px
            padding: 8px
      `}</style>
    </>
  }
}

export default withRouter(User)
