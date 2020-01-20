import {
  isRequired,
  isStateRequiredForCountry,
} from '@hanzo/middleware'

import {
  MUIText,
} from '@hanzo/react'

import {
  assignPath,
  getPath,
  renderUIDate,
} from '@hanzo/utils'

import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'

import {
  makeStyles,
} from '@material-ui/core/styles'

import { observer } from 'mobx-react'

import Router from 'next/router'

import React, { useState } from 'react'

import {
  renderUICurrencyFromJSON,
} from '../../../src/currency'
import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'

const useStyles = makeStyles(() => (
  {
    right: {
      textAlign: 'right',
    },
  }
))

const OrderForm = observer((props) => {
  const classes = useStyles()

  const {
    settingsStore,
    ordersStore,
  } = useStore()

  const { doCreate } = props

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { order, errors } = ordersStore

  const ms = useMidstream({
    email: [isRequired],
    status: [isRequired],
    paymentStatus: [isRequired],
    'shippingAddress.name': [isRequired],
    'shippingAddress.line1': [isRequired],
    'shippingAddress.line2': [],
    'shippingAddress.city': [isRequired],
    'shippingAddress.postalCode': [isRequired],
    'shippingAddress.state': [
      isStateRequiredForCountry(
        () => settingsStore.stateOptions,
        () => ((ordersStore.order && ordersStore.order.shippingAddress) ? ordersStore.order.shippingAddress.country : undefined),
      ),
    ],
    'shippingAddress.country': [isRequired],
  }, {
    order: assignPath(order),
    errors: ordersStore.errors,
  })

  if (props.doCreate) {
    ordersStore.order = undefined
  }

  const {
    hooks,
    run,
    setEmail,
    setStatus,
    setPaymentStatus,
  } = ms

  const submit = async () => {
    setError(false)
    setIsLoading(true)

    try {
      await run()
      const o = await (doCreate ? ordersStore.createOrder() : ordersStore.updateOrder())
      Router.push(`/dash/order?id=${o.id}`)
    } catch (e) {
      console.log('order update error', e)
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const disabled = isLoading || ordersStore.isLoading

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
                <Grid item xs={4}>
                  <Typography variant='body1'>
                    ID
                  </Typography>
                  <Typography variant='body2'>
                    { order.id }
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='body1'>
                    Created At
                  </Typography>
                  <Typography variant='body2'>
                    { renderUIDate(order.createdAt) }
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='body1'>
                    Updated At
                  </Typography>
                  <Typography variant='body2'>
                    { renderUIDate(order.updatedAt) }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        }
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Grid container justify='center' alignItems='flex-start' spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h6'>
                  Order Information
                </Typography>
                { error
                  && <div className='error'>
                    { error }
                  </div>
                }
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Email'
                  variant='outlined'
                  disabled={disabled}
                  value={order.email}
                  error={errors.email}
                  setValue={setEmail}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Name'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(order, 'shippingAddress.name')}
                  error={errors['shippingAddress.name']}
                  setValue={hooks['shippingAddress.name'][1]}
                />
              </Grid>
              <Grid item xs={9}>
                <MUIText
                  label='Address'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(order, 'shippingAddress.line1')}
                  error={errors['shippingAddress.line1']}
                  setValue={hooks['shippingAddress.line1'][1]}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Suite'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(order, 'shippingAddress.line2')}
                  error={errors['shippingAddress.line1']}
                  setValue={hooks['shippingAddress.line1'][1]}
                />
              </Grid>
              <Grid item xs={8}>
                <MUIText
                  label='City'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(order, 'shippingAddress.city')}
                  error={errors['shippingAddress.city']}
                  setValue={hooks['shippingAddress.city'][1]}
                />
              </Grid>
              <Grid item xs={4}>
                <MUIText
                  label='ZIP/Postal Code'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(order, 'shippingAddress.postalCode')}
                  error={errors['shippingAddress.postalCode']}
                  setValue={hooks['shippingAddress.postalCode'][1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Region/State'
                  select
                  options={settingsStore.stateOptions[getPath(order, 'shippingAddress.country')]}
                  variant='outlined'
                  disabled={disabled}
                  placeholder='Select a State'
                  value={getPath(order, 'shippingAddress.state')}
                  error={errors['shippingAddress.state']}
                  setValue={hooks['shippingAddress.state'][1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Country'
                  select
                  options={settingsStore.countryOptions}
                  variant='outlined'
                  disabled={disabled}
                  placeholder='Select a Country'
                  value={getPath(order, 'shippingAddress.country')}
                  error={errors['shippingAddress.country']}
                  setValue={hooks['shippingAddress.country'][1]}
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
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography variant='h6'>
              Receipt
            </Typography>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant='body1'>
                  Number
                </Typography>
                <Typography variant='body2'>
                  { order.number }
                </Typography>
                <br />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>
                  Items
                </Typography>
              </Grid>
              { order.items && order.items.map((item) => (
                <>
                  <Grid item xs={8}>
                    <Typography variant='body2'>
                      {item.quantity} x { item.productName }
                    </Typography>
                    <br />
                  </Grid>
                  <Grid item xs={4} className={classes.right}>
                    <Typography variant='body2'>
                      { renderUICurrencyFromJSON(item.currency, item.price) }
                    </Typography>
                    <br />
                  </Grid>
                </>
              ))}
              <Grid item xs={6}>
                <Typography variant='body2'>
                  <strong>Subtotal</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.right}>
                <Typography variant='body2'>
                  { renderUICurrencyFromJSON(order.currency, order.subtotal) }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body2'>
                  <strong>Discount</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.right}>
                <Typography variant='body2'>
                  { renderUICurrencyFromJSON(order.currency, order.discount) }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body2'>
                  <strong>Total</strong>
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6} className={classes.right}>
                <Typography variant='body2'>
                  { renderUICurrencyFromJSON(order.currency, order.total) }
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body2'>
                  <strong>Paid</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.right}>
                <Typography variant='body2'>
                  { renderUICurrencyFromJSON(order.currency, order.paid) }
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
})

export default OrderForm
