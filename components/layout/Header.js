import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import {
  AccountCircle,
} from '@material-ui/icons'
import Router from 'next/router'
import { useState } from 'react'
import logoImg from '../../assets/images/logo.svg'
import Link from '../link'


const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    padding: 0,
    paddingLeft: theme.spacing(2),
  },
  logoImg: {
    maxHeight: 36,
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
  },
  flex0: {
    flex: 0,
  },
  search: {
    flexGrow: 1,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
}))

export default (props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  // const [query, setQuery] = useState(null)

  // useEffect(() => {
  //   setQuery(qs.parse(window.location.search))
  // }, [])

  const { org, user, logout } = props
  const open = !!anchorEl

  return (
    <AppBar className={classes.root} position='fixed' color='primary'>
      <Toolbar className={classes.toolbar}>
        <Link className={classes.columns} href='/'>
          <img src={logoImg} className={classes.logoImg} alt='logo' />
        </Link>
        <Typography variant='h5'>{org ? org.name : ''}</Typography>
        <IconButton
          className={classes.flex0}
          ariaOwns={open ? 'menu-appbar' : null}
          areaHaspopup='true'
          onClick={(event) => { setAnchorEl(event.currentTarget) }}
          color='inherit'
        >
          <AccountCircle style={{ fontSize: '36px' }} />
        </IconButton>
        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={open}
          onClose={() => { setAnchorEl(null) }}
        >
          <MenuItem>
            <Typography variant='body1'>{`Hi, ${user ? user.firstName : 'UKNOWN'}`}</Typography>
          </MenuItem>
          <MenuItem onClick={() => {
            logout()
            setAnchorEl(null)
            Router.push('/')
          }}>
            <Typography variant='body1'>Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
