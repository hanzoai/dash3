import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useState } from 'react'

const styles = makeStyles(() => ({
  centerCheckbox: {
    justifyContent: 'center',
  },
  itemPadding: {
    marginBottom: '1em',
  },
}))

export default (props) => {
  const classes = styles()

  const { login, loading, onLogin } = props
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState({
    email: '',
    password: '',
  })

  // TODO Validate
  const handleError = (field, msg) => {
    setError({ ...error, [field]: msg })
  }

  const handleEmail = (evt) => {
    handleError('email', '')
    setEmail(evt.target.value)
  }

  const handlePassword = (evt) => {
    handleError('password', '')
    setPassword(evt.target.value)
  }

  const handleRemember = (evt) => {
    setRemember(evt.target.checked)
  }

  const handleLogin = async () => {
    try {
      await login(email, password)
      onLogin()
    } catch (ex) {
      console.error('Error', ex)
      handleError(ex.field, ex.msg)
    }
  }

  const disabled = loading || email === '' || password === '' || error.email !== '' || error.password !== ''

  return (
    <FormGroup autoComplete='off'>
      <TextField
        id='emai'
        variant='outlined'
        label='Email'
        type='email'
        value={email}
        required
        onChange={handleEmail}
        error={error.email !== ''}
        className={classes.itemPadding}
      />
      <TextField
        id='password'
        variant='outlined'
        label='Password'
        type='password'
        required
        value={password}
        onChange={handlePassword}
        error={error.password !== ''}
        className={classes.itemPadding}
      />
      <FormControlLabel
        control={
          <Checkbox checked={remember} onChange={handleRemember} value='remember' />
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
}
