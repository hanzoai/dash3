import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import midstream from 'midstream'

import {
  MUIText,
  MUICheckbox,
} from '@hanzo/react'

import {
  Button,
} from '@material-ui/core'

import classnames from 'classnames'

import {
  isRequired,
  isEmail,
  isPassword,
} from '@hanzo/middleware'

@inject("store")
@observer
class LoginForm extends Component {
  constructor(props) {
    super(props)

    let credentialStore = props.store.credentialStore

    this.ms = midstream({
      email:    [isRequired, isEmail],
      password: [isRequired, isPassword],
      remember: []
    }, {
      dst:    credentialStore,
      errors: credentialStore.errors,
    })

    this.state = {
      error: false,
      isLoading: false
    }
  }

  async submit() {
    this.setState({
      error: false,
      isLoading: true,
    })

    try {
      await this.ms.source.runAll()
      await this.ms.dst.login()

      this.props.onLogin()
    } catch (e) {
      this.setState({
        error: e.message || e,
      })
    }

    this.setState({
        isLoading: false,
    })
  }

  render() {
    const { hooks, dst, errors } = this.ms
    const { error, isLoading } = this.state
    const disabled = isLoading || dst.isLoading

    const [
      getEmail,
      setEmail
    ] = hooks.email

    const [
      getPassword,
      setPassword
    ] = hooks.password

    const [
      getRemember,
      setRemember
    ] = hooks.remember

    return pug`
      .login-form.form
        .error
          =error
        MUIText(
          label='Email'
          variant='outlined'
          disabled=disabled
          value=dst.email
          error=errors.email
          setValue=setEmail
        )
        br
        MUIText(
          label='Password'
          variant='outlined'
          type='password'
          disabled=disabled
          value=dst.password
          error=errors.password
          setValue=setPassword
        )
        MUICheckbox(
          label='Remember Me'
          disabled=disabled
          value=dst.remember
          error=errors.remember
          setValue=setRemember
        )
        Button(
          size='large'
          variant='contained'
          color='primary'
          type='submit'
          disabled=disabled
          onClick=() => this.submit()
        )
          | LOGIN
    `
  }
}

export default LoginForm
