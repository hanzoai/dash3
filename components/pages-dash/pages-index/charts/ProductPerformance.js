import { observer } from 'mobx-react'

import Router from 'next/router'

import React from 'react'

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
    render: (row) => renderUICurrencyFromJSON(
      row.currency,
      row.revenue - row.refunded * row.price,
    ),
  },
  {
    title: 'Sold',
    field: 'sold',
    render: (row) => row.sold,
  },
  {
    title: 'Refunded',
    field: 'refunded',
    render: (row) => row.refunded,
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
