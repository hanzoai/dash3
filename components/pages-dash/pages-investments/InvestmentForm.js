import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { FilePond, registerPlugin } from "react-filepond"

import {
  MUIText,
  MUIKeyboardDatePicker,
  MUIPhone,
  MUISwitch,
} from '@hanzo/react'

import {
  Button,
  Container,
  Divider,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
} from '@material-ui/core'

import Terms from './Terms'

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const steps = [
  {
    label: 'Fundraiser Details',
    form: pug``,
  },
  {
    label: 'Deal Type',
    form: pug``,
  },
  {
    label: 'Deal Documents',
    form: pug``,
  },
  {
    label: 'Agree to Terms',
    form: pug``,
  },
  {
    label: 'Completed',
    form: pug``,
  },
]

const dealTypeOptions = {
  0: 'Equity Priced equity in your film',
  1: 'Convertible Note Debt that can convert to equity',
  2: 'Debt Borrow from investors at set interest terms',
  3: 'Revenue Share Sell a portion of your future revenues to your investors',
}

const DollarInputProps={
  startAdornment: pug`InputAdornment(position='start') $`
}

const PercentInputProps={
  endAdornment: pug`InputAdornment(position='end') %`
}

@inject("store")
@observer
class InvestmentForm extends Component {
  state = {
    stepIdx: 0
  }

  constructor(props) {
    super(props)
  }

  back() {
    this.setState({
      stepIdx: this.state.stepIdx-1,
    })
  }

  canBack() {
    return this.state.stepIndex > 0
  }

  next() {
    this.setState({
      stepIdx: this.state.stepIdx+1,
    })
  }

  canNext() {
    return this.state.stepIndex < steps.length
  }

  isDone() {
    return this.state.stepIndex === steps.length
  }

  render() {
    const { stepIdx } = this.state
    const settingsStore = this.props.store.settingsStore

    return <> {
      pug`
        div.investment-form.form
          Stepper(activeStep=stepIdx)
            each step, i in steps
              Step(key=i)
                StepLabel
                  =step.label
          Typography(variant='h6' align='center')
            =steps[stepIdx].label
          br
          if stepIdx === 0
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | All the details of your deal will be covered in this section. This is where you will define the terms of your deal and provide key documents.
              br
              Typography(variant='body1' align='center')
                | Issuer & Beneficiary
              br
              Grid(container spacing=2)
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Issuer Legal Name'
                    variant='outlined'
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Beneficiary name'
                    variant='outlined'
                  )
                Grid(item xs=12)
                  MUIText(
                    label='Beneficiary account #'
                    variant='outlined'
                    type='password'
                  )
                Grid(item xs=12)
                  MUIText(
                    label='Beneficiary routing #'
                    variant='outlined'
                    type='password'
                  )
              br
              Typography(variant='body1' align='center')
                | Receiving Bank Address
              br
              Grid(container spacing=2)
                Grid(item xs=9)
                  MUIText(
                    label='Address'
                    variant='outlined'
                  )
                Grid(item xs=3)
                  MUIText(
                    label='Suite'
                    variant='outlined'
                  )
                Grid(item xs=8)
                  MUIText(
                    label='City'
                    variant='outlined'
                  )
                Grid(item xs=4)
                  MUIText(
                    label='ZIP/Postal Code'
                    variant='outlined'
                  )
                Grid(item xs=6)
                  MUIText(
                    label='Region/State'
                    select
                    options=settingsStore.stateOptions['US']
                    variant='outlined'
                    placeholder='Select a State'
                  )
                Grid(item xs=6)
                  MUIText(
                    label='Country'
                    select
                    options=settingsStore.countryOptions
                    variant='outlined'
                    disabled=true
                    placeholder='Select a Country'
                    value='US'
                  )
              br
              Typography(variant='body1' align='center')
                | Offering
              br
              Grid(container spacing=2)
                Grid(item xs=12)
                  MUIText(
                    label='Offering Amount'
                    variant='outlined'
                    placeholder='10,000,000.00'
                    InputProps=DollarInputProps
                  )
                Grid(item xs=12)
                  MUIText(
                    label='Valuation'
                    variant='outlined'
                    placeholder='100,000,000.00'
                    InputProps=DollarInputProps
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Minimum Investment Amount'
                    variant='outlined'
                    placeholder='100'
                    InputProps=DollarInputProps
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Maximum Investment Amount'
                    variant='outlined'
                    placeholder='100,000'
                    InputProps=DollarInputProps
                  )
                Grid(item xs=12)
                  MUIKeyboardDatePicker(
                    label='Closing Date'
                    inputVariant='outlined'
                    InputProps=DollarInputProps
                  )
              br
              Button(
                color='primary'
                variant='contained'
                size='large'
                onClick=() => this.next()
              )
                | Next
              br
              br
          if stepIdx === 1
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | Select the deal type that fits your current round.
              br
              Grid(container spacing=2)
                Grid(item xs=12)
                  MUIText(
                    label='DealType'
                    placeholder='Select Deal Type'
                    select
                    options=dealTypeOptions
                    variant='outlined'
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Return'
                    variant='outlined'
                    InputProps=DollarInputProps
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Return Percentage'
                    variant='outlined'
                    InputProps=PercentInputProps
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Maximum Return x Investment Amount'
                    variant='outlined'
                    InputProps=DollarInputProps
                  )
                Grid(item sm=6 xs=12)
                  MUIText(
                    label='Payment Frequency'
                    variant='outlined'
                  )
                Grid(item xs=12)
                  MUIKeyboardDatePicker(
                    label='Payback Start Date'
                    inputVariant='outlined'
                    InputProps=DollarInputProps
                  )
              br
              Grid(container spacing=2)
                Grid(item)
                  Button(
                    size='large'
                    onClick=() => this.back()
                  )
                    | Back
                Grid(item)
                  Button(
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick=() => this.next()
                  )
                    | Next
              br
              br
          if stepIdx === 2
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | An executive summary and term sheet are required. You can add any additional documents and mark them as Confidential to control investor access. 100MB upload limit per document.
              br
              Typography(variant='body2')
                | Term sheet (Subscription document)
              FilePond(
                maxFiles=1
              )
              br
              Typography(variant='body2')
                | Budget
              FilePond(
                maxFiles=1
              )
              br
              Typography(variant='body2')
                | Financials / Sales Projections
              FilePond(
                maxFiles=1
              )
              br
              Typography(variant='body2')
                | Script
              FilePond(
                maxFiles=1
              )
              br
              Typography(variant='body2')
                | Risks & Disclosures
              FilePond(
                maxFiles=1
              )
              br
              Grid(container spacing=2)
                Grid(item)
                  Button(
                    size='large'
                    onClick=() => this.back()
                  )
                    | Back
                Grid(item)
                  Button(
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick=() => this.next()
                  )
                    | Next
              br
              br
          if stepIdx === 3
            Container(maxWidth='sm')
              Typography(variant='body1')
                | By continuing in this process, you acknowledge, agree and understand the following Terms of Use:
              br
              Terms(style={
                overflow: 'scroll',
                maxHeight: 'calc(55vh - 64px)',
              })
              br
              Grid(container spacing=2)
                Grid(item)
                  Button(
                    size='large'
                    onClick=() => this.back()
                  )
                    | Back
                Grid(item)
                  Button(
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick=() => this.next()
                  )
                    | Accept
              br
              br
          if stepIdx === 4
            Container(maxWidth='sm')
              Typography(variant='body1' align='center')
                | Your investment has been submitted!
      `}
    </>
  }
}

export default InvestmentForm
