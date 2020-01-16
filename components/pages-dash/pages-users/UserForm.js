import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import midstream from 'midstream'
import Router from 'next/router'

import {
  MUIText,
  MUISwitch,
} from '@hanzo/react'

import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@material-ui/core'

import {
  getPath,
  assignPath,
  renderUIDate,
} from '@hanzo/utils'

import classnames from 'classnames'

import {
  isRequired,
  isStateRequiredForCountry,
  isEmail,
  isPhone
} from '@hanzo/middleware'

@inject("store")
@observer
class UserForm extends Component {
  constructor(props) {
    super(props)

    let {
      usersStore,
      settingsStore,
    } = props.store

    this.ms = midstream({
      firstName: [isRequired],
      lastName:  [isRequired],
      email:     [isRequired, isEmail],
      'shippingAddress.line1': [isRequired],
      'shippingAddress.line2': [],
      'shippingAddress.city':  [isRequired],
      'shippingAddress.postalCode': [isRequired],
      'shippingAddress.state':      [
        isStateRequiredForCountry(
          () => settingsStore.stateOptions,
          () => (usersStore.user.kyc && usersStore.user.shippingAddress) ? usersStore.user.shippingAddress.country : undefined,
        )
      ],
      'shippingAddress.country':    [isRequired],
      'kyc.flagged': [],
      'kyc.frozen':  [],
      'kyc.status':  [isRequired],
    }, {
      dst: assignPath(usersStore.user),
      errors: usersStore.errors,
    })

    if (props.doCreate) {
      usersStore.user = undefined
    }

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

    const doCreate = this.props.doCreate
    const usersStore = this.props.store.usersStore

    try {
      await this.ms.source.runAll()
      let user = await (doCreate ? usersStore.createUser() : usersStore.updateUser())
      Router.push('/dash/user?id='+user.id)
    } catch (e) {
      console.log('user update error', e)
      this.setState({
        error: e.message || e,
      })
    }

    this.setState({
        isLoading: false,
    })
  }

  render() {
    const usersStore = this.props.store.usersStore
    const settingsStore = this.props.store.settingsStore
    const user = usersStore.user

    const { hooks, errors } = this.ms
    const { error, isLoading } = this.state
    const disabled = isLoading || usersStore.isLoading

    const doCreate = this.props.doCreate

    return pug`
      div.user-form.form
        Grid(container justify='center' alignItems='flex-start' spacing=2)
          Grid(item xs=6)
            if !doCreate
              Card
                CardContent
                  Typography(variant='h6')
                    | Statistics
                  Grid(container)
                    Grid(item xs=4)
                      Typography(variant='body1')
                        | ID
                      Typography(variant='body2')
                        =user.id
                    Grid(item xs=4)
                      Typography(variant='body1')
                        | Created At
                      Typography(variant='body2')
                        =renderUIDate(user.createdAt)
                    Grid(item xs=4)
                      Typography(variant='body1')
                        | Updated At
                      Typography(variant='body2')
                        =renderUIDate(user.updatedAt)
            br
            Card
              CardContent
                Grid(container justify='center' alignItems='flex-start' spacing=2).user-form.form
                  Grid(item xs=12)
                    Typography(variant='h6')
                      | Personal Information
                    .error
                      =error
                  Grid(item xs=12)
                    MUIText(
                      label='Email'
                      variant='outlined'
                      disabled=disabled
                      value=user.email
                      error=errors.email
                      setValue=hooks.email[1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='First Name'
                      variant='outlined'
                      disabled=disabled
                      value=user.firstName
                      error=errors.firstName
                      setValue=hooks.firstName[1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Last Name'
                      variant='outlined'
                      disabled=disabled
                      value=user.lastName
                      error=errors.lastName
                      setValue=hooks.lastName[1]
                    )
                  Grid(item xs=12)
                    Button(
                      size='large'
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled=disabled
                      onClick=() => this.submit()
                    )
                      =doCreate ? 'Create' : 'Save'
          Grid(item xs=6)
            Card
              CardContent
                Grid(container justify='center' alignItems='flex-start' spacing=2).user-form.form
                  Grid(item xs=12)
                    Typography(variant='h6')
                      | Default Shipping Information
                  Grid(item xs=9)
                    MUIText(
                      label='Address'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'shippingAddress.line1')
                      error=errors['shippingAddress.line1']
                      setValue=hooks['shippingAddress.line1'][1]
                    )
                  Grid(item xs=3)
                    MUIText(
                      label='Suite'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'shippingAddress.line2')
                      error=errors['shippingAddress.line1']
                      setValue=hooks['shippingAddress.line1'][1]
                    )
                  Grid(item xs=8)
                    MUIText(
                      label='City'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'shippingAddress.city')
                      error=errors['shippingAddress.city']
                      setValue=hooks['shippingAddress.city'][1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='ZIP/Postal Code'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'shippingAddress.postalCode')
                      error=errors['shippingAddress.postalCode']
                      setValue=hooks['shippingAddress.postalCode'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Region/State'
                      select
                      options=settingsStore.stateOptions[getPath(user, 'shippingAddress.country')]
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a State'
                      value=getPath(user, 'shippingAddress.state')
                      error=errors['shippingAddress.state']
                      setValue=hooks['shippingAddress.state'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Country'
                      select
                      options=settingsStore.countryOptions
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a Country'
                      value=getPath(user, 'shippingAddress.country')
                      error=errors['shippingAddress.country']
                      setValue=hooks['shippingAddress.country'][1]
                    )
                  Grid(item xs=12)
                    Button(
                      size='large'
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled=disabled
                      onClick=() => this.submit()
                    )
                      =doCreate ? 'Create' : 'Save'
          Grid(item xs=6)
    `
  }
}

export default UserForm
