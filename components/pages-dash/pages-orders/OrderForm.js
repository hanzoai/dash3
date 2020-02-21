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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Typography,
} from '@material-ui/core'

import {
  red,
} from '@material-ui/core/colors'

import {
  makeStyles,
} from '@material-ui/core/styles'

import { observer } from 'mobx-react'

import Router from 'next/router'

import React, { useState } from 'react'

import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../../../src/consts'
import {
  renderJSONCurrencyFromUI,
  renderNumericCurrencyFromJSON,
  renderUICurrencyFromJSON,
} from '../../../src/currency'
import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'
import { CreateCurrencyFormat } from '../../controls'
import Link from '../../link'
import { MUITable } from '../../tables'
import searchStyle from '../searchStyle'

const useStyles = makeStyles((theme) => (
  Object.assign(searchStyle(theme), {
    right: {
      textAlign: 'right',
    },
    refundText: {
      color: red[500],
    },
  })
))

const columns = [
  {
    title: 'External Id',
    field: 'id',
    render: (row) => {
      if (row.type === 'stripe') {
        return row.account.chargeId || 'N/A'
      }

      return 'N/A'
    },
  },
  {
    title: 'Type',
    field: 'type',
  },
  {
    title: 'Last 4',
    render: (row) => row.account.lastFour,
  },
  {
    title: 'IP',
    render: (row) => row.client.ip,
  },
  {
    title: 'Country',
    render: (row) => row.client.country,
  },
  {
    title: 'Status',
    field: 'status',
  },
  {
    title: 'Fee',
    render: (row) => renderUICurrencyFromJSON(row.currency, row.fee),
  },
  {
    title: 'Amount',
    render: (row) => renderUICurrencyFromJSON(row.currency, row.amount),
  },
  {
    title: 'Refunded',
    render: (row) => renderUICurrencyFromJSON(row.currency, row.amountRefunded),
  },
]

const OrderForm = observer((props) => {
  const classes = useStyles()

  const {
    settingsStore,
    ordersStore,
  } = useStore()

  const { doCreate } = props

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (props.doCreate && ordersStore.order.id) {
    ordersStore.order = {}
  }

  const { order, errors } = ordersStore
  const { currency } = order

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

  const opts = {
    search: false,
    pageSize: order && order.paymentObjects && order.paymentObjects.length,
    pageSizeOptions: false,
  }

  const {
    hooks,
    run,
  } = ms

  const onRowClick = (event, rowData) => {
    try {
      if (rowData.type === 'stripe') {
        window.open(`//dashboard.stripe.com/payments/${rowData.account.chargeId}`, '_blank')
      }
    } catch (e) {
      setError(e.message || e)
    }
  }

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

  const [refundOpen, setRefundOpen] = React.useState(false)
  const [refund, setRefund] = React.useState(0)
  const [refundError, setRefundError] = React.useState(false)
  const [refundSuccess, setRefundSuccess] = React.useState(false)

  const openRefund = () => {
    setRefundOpen(true)
    setRefund(0)
    setRefundError(false)
    setRefundSuccess(false)
  }

  const closeRefund = () => {
    setRefundOpen(false)
  }

  const executeRefund = async () => {
    setRefundError(false)
    setIsLoading(true)

    try {
      await ordersStore.refundOrder(order.id, refund)
      setRefundSuccess(true)
    } catch (e) {
      setRefundError(e)
    }

    setIsLoading(false)
  }

  return (
    <>
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
                    User Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1'>
                    User ID
                  </Typography>
                  <Typography variant='body2'>
                    <Link href={`/dash/user?id=${order.userId}`} color='secondary'>
                      { order.userId }
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <br />
          <Card>
            <CardContent>
              <Grid container justify='center' alignItems='flex-start' spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6'>
                    Order Information
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <MUIText
                    label='Email'
                    variant='outlined'
                    disabled={disabled}
                    value={order.email}
                    error={errors.email}
                    setValue={hooks.email[1]}
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
              </Grid>
            </CardContent>
          </Card>
          <br />
          <Card>
            <CardContent>
              <Grid container justify='center' alignItems='flex-start' spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6'>
                    Order Status
                  </Typography>
                  { error
                    && <div className='error'>
                      { error }
                    </div>
                  }
                </Grid>
                <Grid item xs={6}>
                  <MUIText
                    label='Order Status'
                    select
                    options={ORDER_STATUS_OPTIONS}
                    variant='outlined'
                    disabled={disabled}
                    placeholder='Select an Order Status'
                    value={order.status}
                    error={errors.status}
                    setValue={hooks.status[1]}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MUIText
                    label='Payment Status'
                    select
                    options={PAYMENT_STATUS_OPTIONS}
                    variant='outlined'
                    disabled={disabled}
                    placeholder='Select an Payment Status'
                    value={order.paymentStatus}
                    error={errors.paymentStatus}
                    setValue={hooks.paymentStatus[1]}
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
                    style={{
                      marginRight: 8,
                    }}
                  >
                    { doCreate ? 'Create' : 'Save' }
                  </Button>
                  { !doCreate
                    && <Button
                        size='large'
                        variant='contained'
                        color='secondary'
                        type='submit'
                        disabled={disabled}
                        onClick={openRefund}
                      >
                        Refund
                      </Button>
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          { !doCreate
            && <Card>
                <CardContent>
                  <Typography variant='h6'>
                    Receipt
                  </Typography>
                  <br />
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant='body2'>
                        <strong>Number</strong>
                      </Typography>
                      <Typography variant='body2'>
                        { order.number }
                      </Typography>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2'>
                        <strong>Items</strong>
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
                    { order.refunded
                      && <>
                        <Grid item xs={6}>
                          <Typography variant='body2' className={classes.refundText}>
                            <strong>Refunded</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.right}>
                          <Typography variant='body2' className={classes.refundText}>
                            { renderUICurrencyFromJSON(order.currency, order.refunded) }
                          </Typography>
                        </Grid>
                      </>
                    }
                    <Grid item xs={6}>
                      <br />
                      <Typography variant='body2'>
                        <strong>Total</strong>
                      </Typography>
                      <br />
                    </Grid>
                    <Grid item xs={6} className={classes.right}>
                      <br />
                      <Typography variant='body2'>
                        { renderUICurrencyFromJSON(order.currency, order.total - order.refunded) }
                      </Typography>
                      <br />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
          }
        </Grid>
        <Grid item xs={12}>
          { !doCreate && order.paymentObjects
            && <div className={classes.table}>
                <MUITable
                  columns={columns}
                  options={opts}
                  isLoading={ordersStore.isLoading}
                  initialPage={0}
                  data={order.paymentObjects}
                  title='Payments'
                  onRowClick={onRowClick}
                />
              </div>
          }
        </Grid>
      </Grid>

      <Dialog open={refundOpen} onClose={closeRefund} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Subscribe</DialogTitle>
        <DialogContent>
          { refundSuccess
            ? <>
              <DialogContentText>
                This refund was successfully processed.
              </DialogContentText>
            </>
            : <>
              <DialogContentText>
                Enter an amount to refund.
              </DialogContentText>
              <MUIText
                label='Refund'
                variant='outlined'
                disabled={disabled}
                InputProps={{
                  inputComponent: CreateCurrencyFormat(currency),
                  endAdornment: <InputAdornment position='end'>{ currency ? currency.toUpperCase() : 'USD'}</InputAdornment>,
                }}
                defaultValue={renderNumericCurrencyFromJSON(currency, refund || 0)}
                setValue={(v) => {
                  const value = renderJSONCurrencyFromUI(currency, v)
                  setRefund(value)
                }}
                error={errors.listPrice || refundError}
              />
            </>
          }
        </DialogContent>
        <DialogActions>
          { refundSuccess
            ? <>
              <Button onClick={closeRefund} variant='outlined' color='primary'>
                Confirm
              </Button>
            </>
            : <>
              <Button
                onClick={closeRefund}
                color='primary'
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                onClick={executeRefund}
                color='secondary'
                disabled={disabled}
              >
                Confirm Refund
              </Button>
            </>
          }
        </DialogActions>
      </Dialog>
    </>
  )
})

export default OrderForm
