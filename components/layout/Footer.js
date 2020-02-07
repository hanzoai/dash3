import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Send from '@material-ui/icons/Send'
import Router from 'next/router'

import Link from '../link'

const useStyles = makeStyles((theme) => ({
  flex1: {
    flex: 1,
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  noPadding: {
    padding: 0,
  },
  rotated: {
    transform: 'rotate(-45deg)',
    position: 'relative',
    left: '3px',
  },
  blockLink: {
    display: 'block',
  },
}))

export default () => {
  const classes = useStyles()

  return (
    <div className='footer'>
      <Toolbar className={classes.noPadding}>
        <div className={classes.flex1}>
          <Link className={classes.blockLink} href="/account/deposit" color={Router.route === '/account/deposit' ? 'secondary' : 'primary'} underline='none'>
            <ArrowUpward />
          </Link>
        </div>
        <div className={classes.flex1}>
          <Link className={classes.blockLink} href="/account/send" color={Router.route === '/account/send' ? 'secondary' : 'primary'} underline='none'>
            <Send className={classes.rotated} />
          </Link>
        </div>
        <div className={classes.flex1}>
          <Link className={classes.blockLink} href="/account/redeem" color={Router.route === '/account/redeem' ? 'secondary' : 'primary'} underline='none'>
            <ArrowDownward />
          </Link>
        </div>
      </Toolbar>
    </div>
  )
}
