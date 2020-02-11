import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Apps as AppsIcon,
  Group as GroupIcon,
  Poll as PollIcon,
  Receipt as ReceiptIcon,
  ShoppingBasket as ShoppingBasketIcon,
} from '@material-ui/icons'
import { observer } from 'mobx-react'
import { useStore } from '../../stores'
import Link from '../link'

const drawerWidth = 200

const useStyles = makeStyles((theme) => ({
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
    paddingTop: '64px',
  },
  rotated: {
    transform: 'rotate(-45deg)',
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
}))

export default observer(() => {
  const classes = useStyles()
  const { credentialStore } = useStore()

  console.log('logged in', credentialStore.isLoggedIn)

  if (!credentialStore.isLoggedIn) {
    return null
  }

  return (
    <Drawer variant='permanent' className={classes.drawer} classes={{ paper: classes.drawerPaper }}>
      <List className={classes.marginTop}>
        <ListItem>
          <ListItemIcon className={classes.listIcon}>
            <Link className={classes.colums} href='/dash' color='textPrimary' underline='none'>
              <PollIcon />
            </Link>
          </ListItemIcon>
          <ListItemText>
            <Link href='/dash' color='textPrimary' underline='none'>
              Overview
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listIcon}>
            <Link className={classes.colums} href='/dash/users' color='textPrimary' underline='none'>
              <GroupIcon />
            </Link>
          </ListItemIcon>
          <ListItemText>
            <Link href='/dash/users' color='textPrimary' underline='none'>
              Users
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listIcon}>
            <Link className={classes.colums} href='/dash/products' color='textPrimary' underline='none'>
              <ShoppingBasketIcon />
            </Link>
          </ListItemIcon>
          <ListItemText>
            <Link href='/dash/products' color='textPrimary' underline='none'>
              Products
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listIcon}>
            <Link className={classes.colums} href='/dash/orders' color='textPrimary' underline='none'>
              <ReceiptIcon />
            </Link>
          </ListItemIcon>
          <ListItemText>
            <Link href='/dash/orders' color='textPrimary' underline='none'>
              Orders
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listIcon}>
            <Link className={classes.colums} href='/dash/integrations' color='textPrimary' underline='none'>
              <AppsIcon />
            </Link>
          </ListItemIcon>
          <ListItemText>
            <Link href='/dash/integrations' color='textPrimary' underline='none'>
              Integrations
            </Link>
          </ListItemText>
        </ListItem>
      </List>
    </Drawer>
  )
})
