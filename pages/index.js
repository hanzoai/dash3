import {
  Card,
  CardContent,
  Grid,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import Router from 'next/router'
import { Component } from 'react'
import logoImg from '../assets/images/logo-dark.svg'
import { IsLoggedOut } from '../components/pages'
import LoginForm from '../components/pages-login/LoginForm'

const styles = {
  index: {
    backgroundColor: '#1a237e',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  logo: {
    maxHeight: 100,
    marginBottom: 20,
  },
  container: {
    minHeight: '100vh',
    height: 'auto',
    padding: 0,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  checkbox: {
    justifyContent: 'center',
  },
}

@IsLoggedOut
@inject('store')
@observer
class Index extends Component {
  render() {
    const { classes, store } = this.props
    return (
      <Grid container id='main' className={classnames(classes.index, classes.container)} justify='center' alignItems='center'>
        <Grid item xs={12} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <img className={classes.logo} src={logoImg} alt='logo' />
              <LoginForm
                onLogin={() => { Router.push('/dash') }}
                login={(u, p) => { store.credentialStore.login(u, p) }}
                loading={store.credentialStore.loading}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Index)
