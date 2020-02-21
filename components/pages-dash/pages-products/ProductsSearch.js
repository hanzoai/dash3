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
  renderJSONCurrencyFromUI,
  renderNumericCurrencyFromJSON,
  renderUICurrencyFromJSON,
} from '../../../src/currency'
import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'
import { CreateCurrencyFormat } from '../../controls'

import { MUITable } from '../../tables'
import searchStyle from '../searchStyle'

const useStyles = makeStyles(searchStyle)

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
    title: 'Price',
    field: 'price',
    render: (row) => renderUICurrencyFromJSON(row.currency, row.price),
  },
  {
    title: 'Sold',
    field: 'name',
    render: (row) => row.sold,
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

const ProductsTable = observer(() => {
  const tableRef = useRef(null)
  const classes = useStyles()
  const {
    credentialStore,
    productsStore,
  } = useStore()

  const currency = credentialStore.org ? credentialStore.org.currency : ''

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const ms = useMidstream({
    q: '',

    Slug: '',
    Name: '',
    Description: '',
    Price: '',
  }, {
    dst: productsStore.searchTokens,
  })

  const {
    setSlug,
    setName,
    setDescription,
    setPrice,
    run,
  } = ms

  const search = async () => {
    setError(false)
    setIsLoading(true)

    try {
      await run()

      productsStore.page = 1
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
      productsStore.productId = rowData.id
      productsStore.product = rowData

      Router.push(`/dash/product?id=${rowData.id}`)
    } catch (e) {
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const create = () => {
    Router.push('/dash/product')
  }

  const { hooks, dst } = ms
  const disabled = isLoading || productsStore.isLoading

  const data = (query) => (
    productsStore.listProducts(query.page + 1, query.pageSize, query)
      .then((res) => ({
        data: res.models,
        page: res.page - 1,
        totalCount: res.count,
      })))

  const opts = {
    search: false,
    pageSize: productsStore.display,
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
              inputValue={hooks.q[1]}
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
          <Grid item>
            <Button
              variant='contained'
              color='secondary'
              type='submit'
              disabled={disabled}
              onClick={create}
            >
              Create
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
                  label='Slug'
                  type='search'
                  placeholder='PROD-ONE'
                  disabled={disabled}
                  shrink
                  value={dst.Slug}
                  setValue={setSlug}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Name'
                  type='search'
                  placeholder='Product One'
                  disabled={disabled}
                  shrink
                  value={dst.Name}
                  setValue={setName}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Description'
                  type='search'
                  placeholder='Product One is...'
                  disabled={disabled}
                  shrink
                  value={dst.EmailPartials}
                  setValue={setDescription}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Price'
                  disabled={disabled}
                  shrink
                  InputProps={{
                    inputComponent: CreateCurrencyFormat(currency),
                    endAdornment: <InputAdornment position='end'>{ currency ? currency.toUpperCase() : 'USD'}</InputAdornment>,
                  }}
                  defaultValue={renderNumericCurrencyFromJSON(currency, dst.Price)}
                  setValue={(v) => {
                    const value = renderJSONCurrencyFromUI(currency, v)
                    setPrice(value)
                  }}
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
          isLoading={productsStore.isLoading}
          initialPage={productsStore.triggerNewSearch ? 0 : undefined}
          data={data}
          title='Products'
          onRowClick={onRowClick}
        />
      </div>
    </div>
  )
})

export default ProductsTable
