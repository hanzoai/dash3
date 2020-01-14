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
class ProductForm extends Component {
  constructor(props) {
    super(props)

    let {
      productsStore,
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
          () => (productsStore.product.kyc && productsStore.product.kyc.address) ? productsStore.product.kyc.address.country : undefined,
        )
      ],
      'kyc.address.country':    [isRequired],
      'kyc.flagged': [],
      'kyc.frozen':  [],
      'kyc.status':  [isRequired],
    }, {
      dst: assignPath(productsStore.product),
      errors: productsStore.errors,
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

    const doCreate = this.props.doCreate
    const productsStore = this.props.store.productsStore

    try {
      await this.ms.source.runAll()
      await doCreate ? productsStore.createProduct() : productsStore.updateProduct()
      Router.push('/dash/product?id='+productsStore.product.id)
    } catch (e) {
      console.log('product update error', e)
      this.setState({
        error: e.message || e,
      })
    }

    this.setState({
        isLoading: false,
    })
  }

  render() {
    const productsStore = this.props.store.productsStore
    const settingsStore = this.props.store.settingsStore
    const product = productsStore.product

    const { hooks, errors } = this.ms
    const { error, isLoading } = this.state
    const disabled = isLoading || productsStore.isLoading

    const doCreate = this.props.doCreate

    return pug`
      div.product-form.form
        Grid(container justify='center' alignItems='flex-start' spacing=2)
          Grid(item xs=6)
            Card
              CardContent
                Typography(variant='h6')
                  | Photo
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
                        =product.id
                    Grid(item xs=4)
                      Typography(variant='body1')
                        | Created At
                      Typography(variant='body2')
                        =renderUIDate(product.createdAt)
                    Grid(item xs=4)
                      Typography(variant='body1')
                        | Updated At
                      Typography(variant='body2')
                        =renderUIDate(product.updatedAt)
          Grid(item xs=6)
            Card
              CardContent
                Grid(container justify='center' alignItems='flex-start' spacing=2).product-form.form
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
                      value=product.email
                      error=errors.email
                      setValue=hooks.email[1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='First Name'
                      variant='outlined'
                      disabled=disabled
                      value=product.firstName
                      error=errors.firstName
                      setValue=hooks.firstName[1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Last Name'
                      variant='outlined'
                      disabled=disabled
                      value=product.lastName
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
                      value=getPath(product, 'kyc.gender')
                      error=errors['kyc.gender']
                      setValue=hooks['kyc.gender'][1]
                    )
                  Grid(item xs=6)
                    MUIKeyboardDatePicker(
                      label='Date of Birth'
                      inputVariant='outlined'
                      disabled=disabled
                      value=getPath(product, 'kyc.birthdate')
                      error=errors['kyc.birthdate']
                      setValue=hooks['kyc.birthdate'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Tax Id(SSN)'
                      sensitive
                      variant='outlined'
                      disabled=disabled
                      value=getPath(product, 'kyc.taxId')
                      error=errors['kyc.taxId']
                      setValue=hooks['kyc.taxId'][1]
                    )
                  Grid(item xs=6)
                    MUIPhone(
                      label='Phone'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(product, 'kyc.phone')
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
                      value=getPath(product, 'kyc.address.line1')
                      error=errors['kyc.address.line1']
                      setValue=hooks['kyc.address.line1'][1]
                    )
                  Grid(item xs=3)
                    MUIText(
                      label='Suite'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(product, 'kyc.address.line2')
                      error=errors['kyc.address.line1']
                      setValue=hooks['kyc.address.line1'][1]
                    )
                  Grid(item xs=8)
                    MUIText(
                      label='City'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(product, 'kyc.address.city')
                      error=errors['kyc.address.city']
                      setValue=hooks['kyc.address.city'][1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='ZIP/Postal Code'
                      variant='outlined'
                      disabled=disabled
                      value=getPath(product, 'kyc.address.postalCode')
                      error=errors['kyc.address.postalCode']
                      setValue=hooks['kyc.address.postalCode'][1]
                    )
                  Grid(item xs=6)
                    MUIText(
                      label='Region/State'
                      select
                      options=settingsStore.stateOptions[getPath(product, 'kyc.address.country')]
                      variant='outlined'
                      disabled=disabled
                      placeholder='Select a State'
                      value=getPath(product, 'kyc.address.state')
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
                      value=getPath(product, 'kyc.address.country')
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
                      defaultValue=getPath(product, 'kyc.flagged')
                      error=errors['kyc.flagged']
                      setValue=hooks['kyc.flagged'][1]
                    )
                  Grid(item xs=4)
                    MUISwitch(
                      label='Frozen'
                      disabled=disabled
                      defaultValue=getPath(product, 'kyc.frozen')
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
                      value=getPath(product, 'kyc.status')
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

export default ProductForm
