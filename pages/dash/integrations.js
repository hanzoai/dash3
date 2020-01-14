import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'
import UserForm from '../../components/pages-dash/pages-users/UserForm'

import css from 'styled-jsx/css'

import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from '@material-ui/core'

import {
  Check as CheckIcon,
} from '@material-ui/icons'

import { STRIPE_CLIENT_ID, STRIPE_REDIRECT_URI } from '../../src/settings'

@isLoggedIn
@inject("store")
@observer
class User extends Component {
  constructor(props) {
    super(props)
  }

  // componentDidMount() {
  //   let id = this.props.router.query.id
  //   this.props.store.usersStore.getUser(id).catch((e) => {
  //     console.log('user page error', e)
  //     Router.push('/dash')
  //   })
  // }

  render() {
    let credentialStore = this.props.store.credentialStore
    let id = ''

    if (credentialStore.org) {
      id = credentialStore.org.id
    }

    console.log('integrations', credentialStore.integrations)

    let stripeConnect = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${STRIPE_REDIRECT_URI}&state=${id}`

    let disabled = id && credentialStore.isLoading

    let CheckIconComponent = pug`CheckIcon`

    return <> {
      pug`
        main#dash.integrations
          Grid(container justify='center' alignItems='center')
            Grid(item xs=3)
              Card
                CardContent
                  Typography(variant='h5')
                    | Stripe
                  Typography(variant='body1')
                    | Connect to Stripe to enable the payment system.
                  br
                CardActions
                  Button(
                    href=stripeConnect
                    fullWidth
                    size='large'
                    variant='contained'
                    color=credentialStore.hasIntegration('stripe') ? 'secondary' : 'primary'
                    type='submit'
                    disabled=disabled
                    startIcon=credentialStore.hasIntegration('stripe') ? CheckIconComponent : undefined
                  )
                    = credentialStore.hasIntegration('stripe') ? 'Connected' : 'Connect'

      `}
      <style jsx global>{`
        #dash.integrations
          padding-left: 200px
          padding-top: 80px
          width: 100vw

          & > *
            margin: 0px
            padding: 8px

          .MuiCardContent-root
            min-height: 100px
      `}</style>
    </>
  }
}

export default withRouter(User)
