import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { IsLoggedIn } from '../../components/pages'
import { UsersSearch } from '../../components/pages-dash'

const useStyles = makeStyles(() => ({
  main: {
    paddingLeft: 200,
    paddingTop: 80,
    width: '100vw',

    '& .MuiExpansionPanelDetails-root': {
      flexDirection: 'column',
    },
  },
}))

const Users = IsLoggedIn(() => {
  const classes = useStyles()

  return <>
    <main className={classes.main} >
      <UsersSearch />
    </main>
  </>
})

export default Users
