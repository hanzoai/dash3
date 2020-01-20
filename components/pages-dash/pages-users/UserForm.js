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
  renderUIDate,
} from '@hanzo/utils'

import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'

import { observer } from 'mobx-react'

import Router from 'next/router'

import React, { useState } from 'react'

import { useMidstream } from '../../../src/hooks'
import { useStore } from '../../../stores'

const UserForm = observer((props) => {
  const {
    settingsStore,
    usersStore,
  } = useStore()

  const { doCreate } = props

  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const ms = useMidstream({
    firstName: [isRequired],
    lastName: [isRequired],
    email: [isRequired, isEmail],
    'shippingAddress.line1': [isRequired],
    'shippingAddress.line2': [],
    'shippingAddress.city': [isRequired],
    'shippingAddress.postalCode': [isRequired],
    'shippingAddress.state': [
      isStateRequiredForCountry(
        () => settingsStore.stateOptions,
        () => ((usersStore.user && usersStore.user.shippingAddress) ? usersStore.user.shippingAddress.country : undefined),
      ),
    ],
    'shippingAddress.country': [isRequired],
    'kyc.flagged': [],
    'kyc.frozen': [],
    'kyc.status': [isRequired],
  }, {
    dst: assignPath(usersStore.user),
    errors: usersStore.errors,
  })

  if (props.doCreate) {
    usersStore.user = undefined
  }

  const { hooks, errors, run } = ms

  const submit = async () => {
    setError(false)
    setIsLoading(true)

    try {
      await run()
      const user = await (doCreate ? usersStore.createUser() : usersStore.updateUser())
      Router.push(`/dash/user?id=${user.id}`)
    } catch (e) {
      console.log('user update error', e)
      setError(e.message || e)
    }

    setIsLoading(false)
  }

  const { user } = usersStore

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
                    { renderUIDate(user.createdAt) }
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='body1'>
                    Updated At
                  </Typography>
                  <Typography variant='body2'>
                    { renderUIDate(user.updatedAt) }
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
    </Grid>
  )
})

export default UserForm
