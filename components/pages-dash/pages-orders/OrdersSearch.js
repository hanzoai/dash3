import {
  MUIText,
} from '@hanzo/react'
import { renderDate } from '@hanzo/utils'

import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  InputAdornment,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import {
  Search as SearchIcon,
} from '@material-ui/icons'

import { observer } from 'mobx-react'
import moment from 'moment-timezone'
import Router from 'next/router'

import React, { useRef, useState } from 'react'

import {
  renderUICurrencyFromJSON,
} from '../../../src/currency'
import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'

import { MUITable } from '../../tables'
import searchStyle from '../searchStyle'

const useStyles = makeStyles(searchStyle)

const columns = [
  {
    title: 'Number',
    field: 'number',
  },
  {
    title: 'Email',
    field: 'email',
  },
  {
    title: 'Total',
    field: 'price',
    render: (row) => renderUICurrencyFromJSON(row.currency, row.total),
  },
  {
    title: 'Order Status',
    field: 'status',
  },
  {
    title: 'Payment Status',
    field: 'paymentStatus',
  },
  {
    title: 'State',
    field: 'shippingAddressState',
    render: (row) => row.shippingAddress.state,
  },
  {
    title: 'Country',
    field: 'shippingAddressCountry',
    render: (row) => row.shippingAddress.country,
  },
  {
    title: 'Created',
    field: 'createdAt',
    render: (row) => renderDate(row.createdAt),
  },
  {
    title: 'Updated',
    field: 'updatedAt',
    render: (row) => moment(row.createdAt).fromNow(),
  },
]

const OrdersTable = observer(() => {
  const tableRef = useRef(null)
  const classes = useStyles()
  const {
    settingsStore,
    ordersStore,
  } = useStore()

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const ms = useMidstream({
    q: '',

    Number: '',
    EmailPartials: '',

    // Address
    ShippingAddressName: '',
    ShippingAddressLine1: '',
    ShippingAddressLine2: '',
    ShippingAddressCity: '',
    ShippingAddressPostalCode: '',
    ShippingAddressStateCode: '',
    ShippingAddressCountryCode: '',
  }, {
    dst: ordersStore.searchTokens,
  })

  const {
    setNumber,
    setEmailPartials,
    setShippingAddressName,
    setShippingAddressLine1,
    setShippingAddressLine2,
    setShippingAddressCity,
    setShippingAddressPostalCode,
    setShippingAddressStateCode,
    setShippingAddressCountryCode,
    run,
  } = ms

  const search = async () => {
    setError(false)
    setIsLoading(true)

    try {
      await run()

      ordersStore.page = 1
      if (tableRef.current) {
        tableRef.current.onQueryChange()
      }
    } catch (e) {
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const onRowClick = (event, rowData) => {
    setError(false)
    setIsLoading(true)

    try {
      ordersStore.orderId = rowData.id
      ordersStore.order = rowData

      Router.push(`/dash/order?id=${rowData.id}`)
    } catch (e) {
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  // const create = () => {
  //   Router.push('/dash/order')
  // }

  const { hooks, dst } = ms
  const disabled = isLoading || ordersStore.isLoading

  const data = (query) => (
    ordersStore.listOrders(query.page + 1, query.pageSize, query)
      .then((res) => ({
        data: res.models,
        page: res.page - 1,
        totalCount: res.count,
      })))

  const opts = {
    search: false,
    pageSize: ordersStore.display,
    pageSizeOptions: [10, 20, 100],
  }

  const SearchInputProps = {
    startAdornment: (
      <InputAdornment position='start'>
        <SearchIcon />
      </InputAdornment>
    ),
  }

  const onEnter = (ev) => {
    if (ev.key === 'Enter') {
      hooks.q[1](ev.target.value)
      search()
      ev.preventDefault()
    }
  }

  return (
    <div>
      <div className={classes.searchForm}>
        { error
          && <div className='error'>
            { error }
          </div>
        }
        <Grid className={classes.searchLine} container spacing={2} alignItems='center'>
          <Grid xs item>
            <MUIText
              placeholder='Search'
              type='search'
              disabled={disabled}
              shrink
              value={dst.q}
              setValue={hooks.q[1]}
              onKeyPress={onEnter}
              InputProps={SearchInputProps}
            />
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={disabled}
              onClick={search}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <ExpansionPanel className={classes.expand}>
          <ExpansionPanelSummary>
            <Typography variant='body1'>
              + Advanced Options
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12}>
                <Typography variant='body2'>
                  Personal Information
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Number'
                  type='search'
                  placeholder='012345'
                  disabled={disabled}
                  shrink
                  value={dst.Number}
                  setValue={setNumber}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Email'
                  type='search'
                  placeholder='person@email.com'
                  disabled={disabled}
                  shrink
                  value={dst.EmailPartials}
                  setValue={setEmailPartials}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Name'
                  type='search'
                  placeholder='Jean Doe'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressName}
                  setValue={setShippingAddressName}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12}>
                <Typography variant='body2'>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <MUIText
                  label='Country'
                  select
                  options={settingsStore.countryOptions}
                  allowEmpty
                  placeholder='Select a Country'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressCountryCode}
                  setValue={setShippingAddressCountryCode}
                />
              </Grid>
              <Grid item xs={4}>
                <MUIText
                  label='Region/State'
                  select
                  options={settingsStore.stateOptions[dst.ShippingAddressCountryCode]}
                  allowEmpty
                  placeholder='Select a State'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressStateCode}
                  setValue={setShippingAddressStateCode}
                />
              </Grid>
              <Grid item xs={4}>
                <MUIText
                  label='ZIP/Postal Code'
                  type='search'
                  placeholder='90017'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressPostalCode}
                  setValue={setShippingAddressPostalCode}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Address'
                  type='search'
                  placeholder='123  Aviation Way'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressLine1}
                  setValue={setShippingAddressLine1}
                />
              </Grid>
              <Grid item xs={2}>
                <MUIText
                  label='Suite'
                  type='search'
                  placeholder='Apt #1'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressLine2}
                  setValue={setShippingAddressLine2}
                />
              </Grid>
              <Grid item xs={4}>
                <MUIText
                  label='City'
                  type='search'
                  placeholder='Los Angeles'
                  disabled={disabled}
                  shrink
                  value={dst.ShippingAddressCity}
                  setValue={setShippingAddressCity}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      <div className={classes.table}>
        <MUITable
          tableRef={tableRef}
          columns={columns}
          options={opts}
          isLoading={ordersStore.isLoading}
          initialPage={ordersStore.triggerNewSearch ? 0 : undefined}
          data={data}
          title='Orders'
          onRowClick={onRowClick}
        />
      </div>
    </div>
  )
})

export default OrdersTable
