import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { observer } from 'mobx-react'
import { useState } from 'react'
import { useStore } from '../../stores'

const styles = makeStyles(() => ({
  centerCheckbox: {
    justifyContent: 'center',
  },
  itemPadding: {
    marginBottom: '1em',
  },
}))

export default observer((props) => {
  const classes = styles()
  const { credentialStore } = useStore()
  const { onLogin } = props

  // TODO Validate
  const handleError = (field, msg) => {
    credentialStore.setError(field, msg)
  }

  const handleLogin = async () => {
    credentialStore.setProperty('isLoading', true)
    try {
      await credentialStore.login()
      onLogin()
    } catch (ex) {
      console.error('Error', ex)
      handleError(ex.field, ex.msg)
    } finally {
      credentialStore.setProperty('isLoading', false)
    }
  }

  const disabled = credentialStore.isLoading
        || credentialStore.email === ''
        || credentialStore.password === ''
        || credentialStore.errors.email !== ''
        || credentialStore.errors.password !== ''

  return (
    <FormGroup autoComplete='off'>
      <TextField
        id='emai'
        variant='outlined'
        label='Email'
        type='email'
        value={credentialStore.email}
        required
        onChange={(evt) => { credentialStore.setProperty('email', evt.target.value) }}
        error={credentialStore.errors.email !== ''}
        className={classes.itemPadding}
      />
      <TextField
        id='password'
        variant='outlined'
        label='Password'
        type='password'
        required
        value={credentialStore.password}
        onChange={(evt) => { credentialStore.setProperty('password', evt.target.value) }}
        error={credentialStore.errors.password !== ''}
        className={classes.itemPadding}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={credentialStore.remember}
            onChange={(evt) => { credentialStore.setProperty('remember', evt.target.checked) }}
            value='remember'
          />
        }
        label='Remember Me'
        className={classes.centerCheckbox}
      />
      <Button
        size='large'
        variant='contained'
        color='primary'
        type='submit'
        disabled={disabled}
        onClick={handleLogin}
      > LOGIN </Button>
    </FormGroup>
  )
})
