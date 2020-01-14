import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import midstream from 'midstream'
import Router from 'next/router'
import moment from 'moment-timezone'

import { MUITable } from '../../tables'
import capitalize from '../../../src/string/capitalize'

import { renderDate } from '@hanzo/utils'
import { cleanPhone } from '@hanzo/middleware'

import {
  MUIText,
  MUIPhone,
  MUIKeyboardDatePicker,
} from '@hanzo/react'

import {
  KYC_STATUS_OPTIONS,
  BOOL_STRING_OPTIONS,
} from '../../../src/consts'

import {
  Button,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Paper,
  InputAdornment,
} from '@material-ui/core'

import {
  Search as SearchIcon,
} from '@material-ui/icons'

const columns = [
  {
    title: 'Slug',
    field: 'slug',
  },
  {
    title: 'Name',
    field: 'name',
  },
  {
    title: 'Description',
    field: 'description',
  },
  {
    title: 'Created',
    field: 'createdAt',
    render: (row) => renderDate(row.createdAt)
  },
  {
    title: 'Updated',
    field: 'updatedAt',
    render: (row) => moment(row.createdAt).fromNow()
  },
]

@inject("store")
@observer
class ProductsTable extends Component {
  constructor(props) {
    super(props)

    this.tableRef = React.createRef()

    const productsStore = props.store.productsStore
    const settingsStore = props.store.settingsStore

    this.ms = midstream({
      KYCPhone: [cleanPhone],
    },
    {
      defaults: {
        q: '',

        // Personal
        FirstNamePartials: '',
        LastNamePartials: '',
        KYCGender: '',
        KYCTaxId: '',
        KYCBirthdate: '',
        CreatedAt: '',

        // Contact
        EmailPartials: '',
        KYCPhone: '',

        // Address
        KYCAddressLine1: '',
        KYCAddressLine2: '',
        KYCAddressCity: '',
        KYCAddressPostalCode: '',
        KYCAddressStateCode: '',
        KYCAddressCountryCode: '',

        // Status
        KYCFlagged: '',
        KYCFrozen: '',
        KYCStatus: '',
      },
      dst: productsStore.searchTokens,
    })

    this.state = {
      error: false,
      isLoading: false,
    }
  }

  async search() {
    this.setState({
      error: false,
      isLoading: true,
    })

    try {
      await this.ms.source.runAll()

      this.props.store.productsStore.page = 1
      this.tableRef.current && this.tableRef.current.onQueryChange()

    } catch (e) {
      this.setState({
        error: e.message || e,
      })
    }

    this.setState({
        isLoading: false,
    })
  }

  async onRowClick(event, rowData) {
    this.setState({
      error: false,
      isLoading: true,
    })

    try {
      const productsStore = this.props.store.productsStore

      productsStore.productId = rowData.id
      productsStore.product = rowData

      Router.push('/dash/product?id='+rowData.id)
    } catch (e) {
      this.setState({
        error: e.message || e,
      })
    }

    this.setState({
        isLoading: false,
    })
  }

  create() {
    Router.push('/dash/product')
  }

  render() {
    const productsStore = this.props.store.productsStore
    const settingsStore = this.props.store.settingsStore

    const { hooks, dst, errors } = this.ms
    const { error, isLoading } = this.state
    const disabled = isLoading || productsStore.isLoading

    let data = (query) => {
      return productsStore.listProducts(query.page + 1, query.pageSize, query)
        .then((res) => {
          return {
            data: res.models,
            page: res.page-1,
            totalCount: res.count,
          }
        })
    }

    let opts = {
      search:          false,
      pageSize:        productsStore.display,
      pageSizeOptions: [10, 20, 100],
    }

    let SearchInputProps =  {
      startAdornment: pug`
        InputAdornment(position='start')
          SearchIcon
        `,
    }

    return <> {
      pug`
        .products-search
          .products-search-form.form
            .error
              =error
            Grid(container spacing=2 alignItems='center')
              Grid(item xs=12).error
                =error
              Grid(item).grow
                MUIText(
                  placeholder='Search'
                  type='search'
                  disabled=disabled
                  shrink=true
                  value=dst.q
                  setValue=hooks.q[1]
                  InputProps=SearchInputProps
                )
              Grid(item)
                Button(
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled=disabled
                  onClick=() => this.search()
                )
                  | Search
              Grid(item)
                Button(
                  variant='contained'
                  color='secondary'
                  type='submit'
                  disabled=disabled
                  onClick=() => this.create()
                )
                  | Create
            br
            ExpansionPanel
              ExpansionPanelSummary
                Typography(variant='body1')
                  | + Advanced Options
              ExpansionPanelDetails
                Grid(container spacing=2 alignItems='center')
                  Grid(item xs=12)
                    Typography(variant='body2')
                      | Personal Information
                  Grid(item xs=2)
                    MUIText(
                      label='First Name'
                      type='search'
                      placeholder='Jean'
                      disabled=disabled
                      shrink=true
                      value=dst.FirstNamePartials
                      setValue=hooks.FirstNamePartials[1]
                    )
                  Grid(item xs=2)
                    MUIText(
                      label='Last Name'
                      type='search'
                      placeholder='Doe'
                      disabled=disabled
                      shrink=true
                      value=dst.LastNamePartials
                      setValue=hooks.LastNamePartials[1]
                    )
                  Grid(item xs=2)
                    MUIText(
                      label='Gender'
                      select
                      options=settingsStore.genderOptions
                      allowEmpty
                      placeholder='Select a Gender'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCGender
                      setValue=hooks.KYCGender[1]
                    )
                  Grid(item xs=2)
                    MUIText(
                      label='Tax Id(SSN)'
                      type='search'
                      placeholder='555-55-5555'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCTaxId
                      setValue=hooks.KYCTaxId[1]
                    )
                  // Ignore until we get proper unix dates in the system
                  // Grid(item xs=2)
                  //   MUIKeyboardDatePicker(
                  //     label='Day of Birth'
                  //     disabled=disabled
                  //     shrink=true
                  //     value=dst.KYCBirthdate
                  //     setValue=hooks.KYCBirthdate[1]
                  //   )
                  // Grid(item xs=2)
                  //   MUIKeyboardDatePicker(
                  //     label='Created on'
                  //     disabled=disabled
                  //     shrink=true
                  //     value=dst.CreatedAt
                  //     setValue=hooks.CreatedAt[1]
                  //   )
                br
                Grid(container spacing=2 alignItems='center')
                  Grid(item xs=12)
                    Typography(variant='body2')
                      | Contact Information
                  Grid(item xs=3)
                    MUIText(
                      label='Email'
                      type='search'
                      placeholder='person@email.com'
                      disabled=disabled
                      shrink=true
                      value=dst.EmailPartials
                      setValue=hooks.EmailPartials[1]
                    )
                  Grid(item xs=3)
                    MUIPhone(
                      label='Phone'
                      type='search'
                      disabled=disabled
                      value=dst.KYCPhone
                      setValue=hooks.KYCPhone[1]
                    )
                br
                Grid(container spacing=2 alignItems='center')
                  Grid(item xs=12)
                    Typography(variant='body2')
                      | Address
                  Grid(item xs=6)
                    MUIText(
                      label='Address'
                      type='search'
                      placeholder='123  Aviation Way'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCAddressLine1
                      setValue=hooks.KYCAddressLine1[1]
                    )
                  Grid(item xs=2)
                    MUIText(
                      label='Suite'
                      type='search'
                      placeholder='Apt #1'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCAddressLine2
                      setValue=hooks.KYCAddressLine2[1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='City'
                      type='search'
                      placeholder='Los Angeles'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCAddressCity
                      setValue=hooks.KYCAddressCity[1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='ZIP/Postal Code'
                      type='search'
                      placeholder='90017'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCAddressPostalCode
                      setValue=hooks.KYCAddressPostalCode[1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='Region/State'
                      select
                      options=settingsStore.stateOptions[dst.KYCAddressCountryCode]
                      allowEmpty
                      placeholder='Select a State'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCAddressStateCode
                      setValue=hooks.KYCAddressStateCode[1]
                    )
                  Grid(item xs=4)
                    MUIText(
                      label='Country'
                      select
                      options=settingsStore.countryOptions
                      allowEmpty
                      placeholder='Select a Country'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCAddressCountryCode
                      setValue=hooks.KYCAddressCountryCode[1]
                    )
                br
                Grid(container spacing=2 alignItems='center')
                  Grid(item xs=12)
                    Typography(variant='body2')
                      | Status
                  Grid(item xs=2)
                    MUIText(
                      label='Flagged'
                      select
                      options=BOOL_STRING_OPTIONS
                      allowEmpty
                      placeholder='Select an Option'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCFlagged
                      setValue=hooks.KYCFlagged[1]
                    )
                  Grid(item xs=2)
                    MUIText(
                      label='Frozen'
                      select
                      options=BOOL_STRING_OPTIONS
                      allowEmpty
                      placeholder='Select an Option'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCFrozen
                      setValue=hooks.KYCFrozen[1]
                    )
                  Grid(item xs=2)
                    MUIText(
                      label='Status'
                      type='search'
                      select
                      options=KYC_STATUS_OPTIONS
                      allowEmpty
                      placeholder='Select a Status'
                      disabled=disabled
                      shrink=true
                      value=dst.KYCStatus
                      setValue=hooks.KYCStatus[1]
                    )
          br
          .products-table.table
            MUITable(
              tableRef=this.tableRef
              columns=columns
              options=opts
              isLoading=productsStore.isLoading
              initialPage=productsStore.triggerNewSearch ? 0 : undefined
              data=data
              title='Products'
              onRowClick=this.onRowClick.bind(this)
            )
      `}
      <style jsx global>{`
        .products-search
          .grow
            flex-grow: 1
      `}</style>
    </>
  }
}

export default ProductsTable
