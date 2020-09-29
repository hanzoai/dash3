import {
  isEmail,
  isRequired,
  isStateRequiredForCountry,
} from '@hanzo/middleware'

import {
  MUIText,
} from '@hanzo/react'

import {
  assignPath,
  getPath,
  renderDate,
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
import moment from 'moment-timezone'
import Router from 'next/router'

import React, { useState } from 'react'

import {
  renderUICurrencyFromJSON,
} from '../../../src/currency'
import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'
import { MUITable } from '../../tables'
import searchStyle from '../searchStyle'

const useStyles = makeStyles((theme) => (
  Object.assign(searchStyle(theme), {
    right: {
      textAlign: 'right',
    },
  })
))

const columns = [
  {
    title: 'Number',
    field: 'number',
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

const referralsColumns = [
  {
    title: 'Id',
    field: 'id',
  },
  {
    title: 'OrderId',
    field: 'orderId',
  },
  {
    title: 'Valid',
    field: 'createdAt',
    render: (row) => (row.revoked ? 'False' : 'True'),
  },
  {
    title: 'Created',
    field: 'createdAt',
    render: (row) => renderDate(row.createdAt),
  },
]

const UserForm = observer((props) => {
  const classes = useStyles()

  const {
    settingsStore,
    usersStore,
    ordersStore,
  } = useStore()

  const { doCreate } = props

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (props.doCreate && usersStore.user.id) {
    usersStore.user = {}
  }

  const ms = useMidstream({
    firstName: [isRequired],
    lastName: [isRequired],
    email: [isRequired, isEmail],
    'shippingAddress.line1': [],
    'shippingAddress.line2': [],
    'shippingAddress.city': [],
    'shippingAddress.postalCode': [],
    'shippingAddress.state': [
      isStateRequiredForCountry(
        () => settingsStore.stateOptions,
        () => ((usersStore.user && usersStore.user.shippingAddress) ? usersStore.user.shippingAddress.country : undefined),
      ),
    ],
    'shippingAddress.country': [],
    'kyc.flagged': [],
    'kyc.frozen': [],
    'kyc.status': [isRequired],
  }, {
    dst: assignPath(usersStore.user),
    errors: usersStore.errors,
  })

  const { user } = usersStore

  const opts = {
    search: false,
    pageSize: user && user.orders && user.orders.length,
    pageSizeOptions: false,
  }

  const {
    hooks,
    errors,
    run,
  } = ms

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

  const onReferralRowClick = (event, rowData) => {
    setError(false)
    setIsLoading(true)

    try {
      ordersStore.orderId = rowData.orderId

      Router.push(`/dash/order?id=${rowData.orderId}`)
    } catch (e) {
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const submit = async () => {
    setError(false)
    setIsLoading(true)

    try {
      await run()
      const u = await (doCreate ? usersStore.createUser() : usersStore.updateUser())
      Router.push(`/dash/user?id=${u.id}`)
    } catch (e) {
      console.log('user update error', e)
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const disabled = isLoading || usersStore.isLoading

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
                    { user.id }
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='body1'>
                    Created At
                  </Typography>
                  <Typography variant='body2'>
                    { renderDate(user.createdAt) }
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='body1'>
                    Updated At
                  </Typography>
                  <Typography variant='body2'>
                    { renderDate(user.updatedAt) }
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
                  Personal Information
                </Typography>
                { error
                  && <div className='error'>
                    { error }
                  </div>
                }
              </Grid>
              <Grid item xs={12}>
                <MUIText
                  label='Email'
                  variant='outlined'
                  disabled={disabled}
                  value={user.email}
                  error={errors.email}
                  setValue={hooks.email[1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='First Name'
                  variant='outlined'
                  disabled={disabled}
                  value={user.firstName}
                  error={errors.firstName}
                  setValue={hooks.firstName[1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Last Name'
                  variant='outlined'
                  disabled={disabled}
                  value={user.lastName}
                  error={errors.lastName}
                  setValue={hooks.lastName[1]}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container justify='center' alignItems='flex-start' spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h6'>
                  Default Shipping Information
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <MUIText
                  label='Address'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(user, 'shippingAddress.line1')}
                  error={errors['shippingAddress.line1']}
                  setValue={hooks['shippingAddress.line1'][1]}
                />
              </Grid>
              <Grid item xs={3}>
                <MUIText
                  label='Suite'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(user, 'shippingAddress.line2')}
                  error={errors['shippingAddress.line1']}
                  setValue={hooks['shippingAddress.line1'][1]}
                />
              </Grid>
              <Grid item xs={8}>
                <MUIText
                  label='City'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(user, 'shippingAddress.city')}
                  error={errors['shippingAddress.city']}
                  setValue={hooks['shippingAddress.city'][1]}
                />
              </Grid>
              <Grid item xs={4}>
                <MUIText
                  label='ZIP/Postal Code'
                  variant='outlined'
                  disabled={disabled}
                  value={getPath(user, 'shippingAddress.postalCode')}
                  error={errors['shippingAddress.postalCode']}
                  setValue={hooks['shippingAddress.postalCode'][1]}
                />
              </Grid>
              <Grid item xs={6}>
                <MUIText
                  label='Region/State'
                  select
                  options={settingsStore.stateOptions[getPath(user, 'shippingAddress.country')]}
                  variant='outlined'
                  disabled={disabled}
                  placeholder='Select a State'
                  value={getPath(user, 'shippingAddress.state')}
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
                  value={getPath(user, 'shippingAddress.country')}
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
      <Grid item xs={6}/>
      <Grid item xs={12}>
        { !doCreate && user.orders && !!user.orders.length
          && <div className={classes.table}>
              <MUITable
                columns={columns}
                options={opts}
                isLoading={usersStore.isLoading}
                initialPage={0}
                data={user.orders}
                title='Orders'
                onRowClick={onRowClick}
              />
            </div>
        }
      </Grid>
      <Grid item xs={12}>
        { !doCreate && user.referrals && !!user.referrals.length
          && <div className={classes.table}>
              <MUITable
                columns={referralsColumns}
                options={opts}
                isLoading={usersStore.isLoading}
                initialPage={0}
                data={user.referrals}
                title='Referrals'
                onRowClick={onReferralRowClick}
              />
            </div>
        }
      </Grid>
    </Grid>
  )
})

export default UserForm
