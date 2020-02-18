import { observer } from 'mobx-react'

import Router from 'next/router'

import React from 'react'
import numeral from 'numeral'
import {
  renderUICurrencyFromJSON,
} from '../../../../src/currency'
import { useStore } from '../../../../stores'
import { MUITable } from '../../../tables'

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
    title: 'Revenue',
    field: 'revenue',
    render: (row) => numeral(renderUICurrencyFromJSON(
      row.currency,
      row.revenue - row.refunded * row.price,
    )).format('$0,0.00'),
  },
  {
    title: 'Sold',
    field: 'sold',
    render: (row) => numeral(row.sold).format('0,0'),
  },
  {
    title: 'Refunded',
    field: 'refunded',
    render: (row) => numeral(row.refunded).format('0,0'),
  },
]

const ProductPerformance = observer(() => {
  const {
    dashboardStore,
    productsStore,
  } = useStore()

  const {
    products,
  } = dashboardStore

  const opts = {
    search: false,
    pageSize: products ? products.length : 1,
  }

  const onRowClick = (event, rowData) => {
    productsStore.productId = rowData.id
    productsStore.product = rowData

    Router.push(`/dash/product?id=${rowData.id}`)
  }

  return (
    <>
      { products
        && products.length
        && <MUITable
          columns={columns}
          options={opts}
          isLoading={dashboardStore.isLoading}
          initialPage={1}
          data={products}
          title='Product Performance'
          onRowClick={onRowClick}
        />
      }
    </>
  )
})

export default ProductPerformance
