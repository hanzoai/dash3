import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { isLoggedIn } from '../../components/pages'
import { Dashboard } from '../../components/pages-dash'

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: 200,
    paddingTop: 64,
    width: '100vw',

    '& > .MuiGrid-root': {
      width: '100%',
      margin: 0,
      padding: theme.spacing(2),
    },
  },
}))

const Dash = isLoggedIn(() => {
  const classes = useStyles()

  return <>
    <main className={classes.main} >
      <Dashboard/>
    </main>
  </>
})

export default Dash
