import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import midstream from 'midstream'
import Router from 'next/router'

import {
  MUIText,
  MUIKeyboardDatePicker,
  MUIPhone,
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

import {
  KYC_STATUS_OPTIONS
} from '../../../src/consts'

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
      'kyc.gender':    [isRequired],
      'kyc.birthdate': [isRequired],
      'kyc.taxId':     [isRequired],
      'kyc.phone':     [isRequired, isPhone],
      'kyc.address.line1': [isRequired],
      'kyc.address.line2': [],
      'kyc.address.city':  [isRequired],
      'kyc.address.postalCode': [isRequired],
      'kyc.address.state':      [
        isStateRequiredForCountry(
          () => settingsStore.stateOptions,
          () => (usersStore.user.kyc && usersStore.user.kyc.address) ? usersStore.user.kyc.address.country : undefined,
        )
      ],
      'kyc.address.country':    [isRequired],
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
          Grid(item sm=6 xs=12)
            Card
              CardContent
                Typography(variant='h6')
                  | Photo
                if user.kyc && user.kyc.documents
                  Grid(container)
                    each document, i in user.kyc.documents
                      Grid(item key=i xs=4)
                        img(src=document)
            br
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
          Grid(item xs=6)
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
                  Grid(item xs=6)
                    MUIText(
                      label='Gender'
                      select
                      options=settingsStore.genderOptions
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a Gender'
                      value=getPath(user, 'kyc.gender')
                      error=errors['kyc.gender']
                      setValue=hooks['kyc.gender'][1]
                    )
                  Grid(item xs=6)
                    MUIKeyboardDatePicker(
                      label='Date of Birth'
                      inputVariant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.birthdate')
                      error=errors['kyc.birthdate']
                      setValue=hooks['kyc.birthdate'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Tax Id(SSN)'
                      sensitive
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.taxId')
                      error=errors['kyc.taxId']
                      setValue=hooks['kyc.taxId'][1]
                    )
                  Grid(item xs=6)
                    MUIPhone(
                      label='Phone'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.phone')
                      error=errors['kyc.phone']
                      inputValue=hooks['kyc.phone'][1]
                    )
                  Grid(item xs=12)
                    br
                    Typography(variant='h6')
                      | Contact Information
                  Grid(item xs=9)
                    MUIText(
                      label='Address'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.address.line1')
                      error=errors['kyc.address.line1']
                      setValue=hooks['kyc.address.line1'][1]
                    )
                  Grid(item xs=3)
                    MUIText(
                      label='Suite'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.address.line2')
                      error=errors['kyc.address.line1']
                      setValue=hooks['kyc.address.line1'][1]
                    )
                  Grid(item xs=8)
                    MUIText(
                      label='City'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.address.city')
                      error=errors['kyc.address.city']
                      setValue=hooks['kyc.address.city'][1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='ZIP/Postal Code'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(user, 'kyc.address.postalCode')
                      error=errors['kyc.address.postalCode']
                      setValue=hooks['kyc.address.postalCode'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Region/State'
                      select
                      options=settingsStore.stateOptions[getPath(user, 'kyc.address.country')]
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a State'
                      value=getPath(user, 'kyc.address.state')
                      error=errors['kyc.address.state']
                      setValue=hooks['kyc.address.state'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Country'
                      select
                      options=settingsStore.countryOptions
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a Country'
                      value=getPath(user, 'kyc.address.country')
                      error=errors['kyc.address.country']
                      setValue=hooks['kyc.address.country'][1]
                    )
                  Grid(item xs=12)
                    br
                    Typography(variant='h6')
                      | Know Your Customer
                  Grid(item xs=4)
                    MUISwitch(
                      label='Flagged'
                      disabled=disabled
                      defaultValue=getPath(user, 'kyc.flagged')
                      error=errors['kyc.flagged']
                      setValue=hooks['kyc.flagged'][1]
                    )
                  Grid(item xs=4)
                    MUISwitch(
                      label='Frozen'
                      disabled=disabled
                      defaultValue=getPath(user, 'kyc.frozen')
                      error=errors['kyc.frozen']
                      setValue=hooks['kyc.frozen'][1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='Status'
                      select
                      options=KYC_STATUS_OPTIONS
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a Status'
                      value=getPath(user, 'kyc.status')
                      error=errors['kyc.status']
                      setValue=hooks['kyc.status'][1]
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
    `
  }
}

export default UserForm
