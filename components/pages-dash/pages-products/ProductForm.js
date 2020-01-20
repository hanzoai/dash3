import {
  isRequired,
} from '@hanzo/middleware'

import {
  MUIText,
  MUISwitch,
} from '@hanzo/react'

import {
  renderUIDate,
} from '@hanzo/utils'

import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Typography,
} from '@material-ui/core'

import { observer } from 'mobx-react'

import Router from 'next/router'

import React, { useState } from 'react'

import {
  renderJSONCurrencyFromUI,
  renderNumericCurrencyFromJSON,
} from '../../../src/currency'
import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'
import { CreateCurrencyFormat } from '../../controls'

const ProductForm = observer((props) => {
  const {
    credentialStore,
    productsStore,
  } = useStore()

  const currency = credentialStore.org ? credentialStore.org.currency : ''

  const { doCreate } = props

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (props.doCreate) {
    productsStore.product = {}
  }

  const ms = useMidstream({
    slug: [isRequired],
    name: [isRequired],
    sku: [],
    description: [],
    price: [isRequired],
    listPrice: [isRequired],
    preorder: [],
    taxable: [],
  }, {
    dst: productsStore.product,
    errors: productsStore.errors,
  })

  const {
    hooks,
    dst,
    errors,
    run,
    setPrice,
  } = ms

  const submit = async () => {
    setError(false)
    setIsLoading(true)

    try {
      await run()
      const product = await (doCreate ? productsStore.createProduct() : productsStore.updateProduct())
      Router.push(`/dash/product?id=${product.id}`)
    } catch (e) {
      console.log('product update error', e)
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const disabled = isLoading || productsStore.isLoading

  return (
    <Grid container justify='center' alignItems='flex-start' spacing={2}>
      <Grid item xs={12}>
        { !doCreate
          && <Card>
            <CardContent>
              <Typography variant='h6'>
                Statistics
              </Typography>
              <Grid container>
                <Grid item xs={3}>
                  <Typography variant='body1'>
                    ID
                  </Typography>
                  <Typography variant='body2'>
                    { dst.id }
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='body1'>
                    Created At
                  </Typography>
                  <Typography variant='body2'>
                    { renderUIDate(dst.createdAt) }
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='body1'>
                    Updated At
                  </Typography>
                  <Typography variant='body2'>
                    { renderUIDate(dst.updatedAt) }
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='body1'>
                    Units Sold
                  </Typography>
                  <Typography variant='body2'>
                    { dst.sold }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        }
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container justify='center' alignItems='flex-start' spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h6'>
                  Product Information
                </Typography>
                { error
                  && <div className='error'>
                    { error }
                  </div>
                }
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Slug'
                  variant='outlined'
                  disabled={disabled}
                  value={dst.slug}
                  error={errors.slug}
                  setValue={hooks.slug[1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='SKU'
                  variant='outlined'
                  disabled={disabled}
                  value={dst.sku}
                  error={errors.sku}
                  setValue={hooks.sku[1]}
                />
              </Grid>
              <Grid item xs={12}>
                <MUIText
                  label='Name'
                  variant='outlined'
                  disabled={disabled}
                  value={dst.name}
                  error={errors.name}
                  setValue={hooks.name[1]}
                />
              </Grid>
              <Grid item xs={12}>
                <MUIText
                  label='Description'
                  variant='outlined'
                  multiline
                  disabled={disabled}
                  value={dst.description}
                  error={errors.description}
                  setValue={hooks.description[1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Display Price'
                  variant='outlined'
                  disabled={disabled}
                  InputProps={{
                    inputComponent: CreateCurrencyFormat(currency),
                    endAdornment: <InputAdornment position='end'>{ currency ? currency.toUpperCase() : 'USD'}</InputAdornment>,
                  }}
                  defaultValue={renderNumericCurrencyFromJSON(currency, dst.price) || 0}
                  setValue={(v) => {
                    const value = renderJSONCurrencyFromUI(currency, v)
                    setPrice(value)
                  }}
                  error={errors.price}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Non-Discount Price (optional)'
                  variant='outlined'
                  disabled={disabled}
                  InputProps={{
                    inputComponent: CreateCurrencyFormat(currency),
                    endAdornment: <InputAdornment position='end'>{ currency ? currency.toUpperCase() : 'USD'}</InputAdornment>,
                  }}
                  defaultValue={renderNumericCurrencyFromJSON(currency, dst.listPrice) || 0}
                  setValue={(v) => {
                    const value = renderJSONCurrencyFromUI(currency, v)
                    setPrice(value)
                  }}
                  error={errors.listPrice}
                />
              </Grid>
              <Grid item xs={6}>
                <MUISwitch
                  label='Preorder'
                  variant='outlined'
                  disabled={disabled}
                  value={dst.preorder}
                  setValue={hooks.preorder[1]}
                  error={errors.preorder}
                />
              </Grid>
              <Grid item xs={6}>
                <MUISwitch
                  label='Taxable'
                  variant='outlined'
                  disabled={disabled}
                  value={dst.taxable}
                  setValue={hooks.taxable[1]}
                  error={errors.taxable}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  size='large'
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={disabled}
                  onClick={submit}
                >
                  { doCreate ? 'Create' : 'Save' }
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
})

export default ProductForm
