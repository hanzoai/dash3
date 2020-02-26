import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'
import {
  Check as CheckIcon,
} from '@material-ui/icons'
import { withStyles } from '@material-ui/styles'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'next/router'
import { Component } from 'react'
import { IsLoggedIn } from '../../components/pages'

import { STRIPE_CLIENT_ID, STRIPE_REDIRECT_URI } from '../../src/settings'


const styles = () => ({
  integrations: {
    paddingLeft: '200px',
    paddingTop: '80px',
    width: '100vw',
    height: 'calc(100vh - 80px)',
    '& > *': {
      width: '100%',
      margin: '0px',
      padding: '8px',
    },
    'MuiCardContent-root': {
      minHeight: '100px',
    },
  },
})
@IsLoggedIn
@inject('store')
@observer
class Integrations extends Component {
  // componentDidMount() {
  //   let id = this.props.router.query.id
  //   this.props.store.usersStore.getUser(id).catch((e) => {
  //     console.log('user page error', e)
  //     Router.push('/dash')
  //   })
  // }

  render() {
    const { store, classes } = this.props
    const { credentialStore } = store
    let id = ''

    if (credentialStore.org) {
      id = credentialStore.org.id
    }

    const stripeConnect = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${STRIPE_REDIRECT_URI}&state=${id}`
    const disabled = id.length === 0 && credentialStore.isLoading

    return (
      <main className={classes.integrations}>
        <Grid container justify='center' alignItems='center'>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant='h5'>
                  Stripe
                </Typography>
                <Typography variant='body1'>
                  Connect to Stripe to enable the payment system.
                </Typography>
                <CardActions>
                  <Button
                    href={stripeConnect}
                    fullWidth
                    size='large'
                    variant='contained'
                    color={credentialStore.hasIntegration('stripe') ? 'secondary' : 'primary'}
                    type='submit'
                    disabled={disabled}
                    startIcon={credentialStore.hasIntegration('stripe') ? <CheckIcon /> : undefined}
                  >
                    {credentialStore.hasIntegration('stripe') ? 'Connected' : 'Connect'}
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    )
  }
}

export default withRouter(withStyles(styles)(Integrations))
