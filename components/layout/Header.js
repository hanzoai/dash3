import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Router from 'next/router'

import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core'
import {
  AccountCircle as AccountCircleIcon,
  Search as SearchIcon,
} from '@material-ui/icons'

import Link from '../link'
// import MUIText from '../controls/mui-text'
// import MUIInput from '../controls/mui-input'

import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'

import logoImg from '../../assets/images/logo.svg'

import * as qs from 'query-string'

import { isRequired } from '@hanzo/middleware'

@inject("store")
@observer
class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
    }
  }

  componentDidMount() {
    let query = qs.parse(window.location.search)
  }

  handleMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    })
  }

  _submit() {
    Router.push('/dash/search?q=' + this.inputs.search.val())
  }

  logout() {
    this.props.store.credentialStore.logout()
    this.handleClose()
    Router.push('/')
  }

  render() {
    const { classes, store, ...props } = this.props
    const credentialStore = store.credentialStore

    let { user, org } = credentialStore

    let open = !!this.state.anchorEl

    return pug`
        if credentialStore.isLoggedIn
          AppBar(
            className=classes.root
            position='fixed'
            color='primary'
          )
            Toolbar(className=classes.toolbar)
              Link.columns(href='/')
                img(className=classes.logoImg src=logoImg)
              form(
                className=classes.search
                onSubmit=this.submit
              )
                // IconButton(className=classes.searchIcon type='submit')
                //   SearchIcon
              Typography(variant='h5')
                =org ? org.name : ''
              IconButton(
                className=classes.flex0
                aria-owns=(open ? 'menu-appbar' : undefined)
                aria-haspopup='true'
                onClick=this.handleMenu
                color='inherit'
              )
                AccountCircleIcon(style={ fontSize: 36 })
              Menu(
                id='menu-appbar'
                anchorEl=this.state.anchorEl
                anchorOrigin={
                  vertical: 'bottom',
                  horizontal: 'right',
                }
                transformOrigin={
                  vertical: 'bottom',
                  horizontal: 'right',
                }
                open=open
                onClose=this.handleClose
              )
                MenuItem
                  Typography(variant='body1')
                    ='hi, ' + user.firstName
                MenuItem(onClick=this.logout.bind(this)) Logout
    `
  }
}

const styles = (theme) => {
  return {
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
  }
}

export default withStyles(styles)(Header)
