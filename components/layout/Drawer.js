import { Component } from 'react'
import { inject, observer } from 'mobx-react'

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import {
  Group as GroupIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Send as SendIcon,
  LibraryBooks as LibraryBooksIcon,
  PowerSettingsNew as PowerSettingsIcon,
  AttachMoney as AttachMoneyIcon,
  SettingsApplications as SettingsApplicationsIcon,
  Storage as StorageIcon,
  Movie as MovieIcon,
  Apps as AppsIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
} from '@material-ui/icons'

import Link from '../link'

import { withStyles } from '@material-ui/core/styles'

const drawerWidth = 200

@inject("store")
@observer
class MyDrawer extends Component {
  render() {
    const { classes, store, ...props } = this.props
    const credentialStore = store.credentialStore

    return pug `
      if credentialStore.isLoggedIn
        Drawer(
          ...props
          className=classes.drawer
          classes={
            paper: classes.drawerPaper,
          }
        )
          div(className=classes.toolbar)
          List(className=classes.marginTop)
            ListItem
              ListItemIcon(className=classes.listIcon)
                Link.columns(href='/dash' color='textPrimary' underline='none')
                  GroupIcon
              ListItemText
                Link(href='/dash' color='textPrimary' underline='none')
                  | Users
            ListItem
              ListItemIcon(className=classes.listIcon)
                Link.columns(href='/dash/products' color='textPrimary' underline='none')
                  ShoppingBasketIcon
              ListItemText
                Link(href='/dash/products' color='textPrimary' underline='none')
                  | Products
            ListItem
              ListItemIcon(className=classes.listIcon)
                Link.columns(href='/dash/orders' color='textPrimary' underline='none')
                  ReceiptIcon
              ListItemText
                Link(href='/dash/orders' color='textPrimary' underline='none')
                  | Orders
            br
            ListItem
              ListItemIcon(className=classes.listIcon)
                Link.columns(href='/dash/integrations' color='textPrimary' underline='none')
                  AppsIcon
              ListItemText
                Link(href='/dash/integrations' color='textPrimary' underline='none')
                  | Integrations
            // ListItem
            //   ListItemIcon(className=classes.listIcon)
            //     Link.columns(href='/dash/settings' color='textPrimary' underline='none')
            //       SettingsApplicationsIcon
            //   ListItemText
            //     Link(href='/dash/settings' color='textPrimary' underline='none')
            //       | Settings
            // ListItem
            //   ListItemIcon(className=classes.listIcon)
            //     Link.columns(href='/dash/transactions' color='textPrimary' underline='none')
            //       SendIcon(className=classes.rotated)
            //   ListItemText
            //     Link(href='/dash/transactions' color='textPrimary' underline='none')
            //       | Transactions
            // ListItem
            //   ListItemIcon(className=classes.listIcon)
            //     Link.columns(href='/dash/disclosures' color='textPrimary' underline='none')
            //       LibraryBooksIcon
            //   ListItemText
            //     Link(href='/dash/disclosures' color='textPrimary' underline='none')
            //       | Disclosures
            // ListItem
            //   ListItemIcon(className=classes.listIcon)
            //     Link.columns(href='/dash/admin' color='textPrimary' underline='none')
            //       PowerSettingsIcon
            //   ListItemText
            //     Link(href='/dash/admin' color='textPrimary' underline='none')
            //       | Admin
            // ListItem
            //   ListItemIcon(className=classes.listIcon)
            //     Link.columns(href='/dash/fund' color='textPrimary' underline='none')
            //       AttachMoneyIcon
            //   ListItemText
            //     Link(href='/dash/fund' color='textPrimary' underline='none')
            //       | Fund
    `
  }
}

const styles = (theme) => {
  return {
    listIcon: {
      margin: 0,
      minWidth: 'initial',
      marginRight: theme.spacing(1),
    },
    toolbar: theme.mixins.toolbar,
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    rotated: {
      transform: 'rotate(-45deg)',
    },
    marginTop: {
      marginTop: theme.spacing(1),
    },
  }
}

export default withStyles(styles)(MyDrawer)

