import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { isLoggedIn } from '../../components/pages'
import { UsersSearch } from '../../components/pages-dash'

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: 200,
    paddingTop: 80,
    width: '100vw',
  },
}))

const Users = isLoggedIn(() => {
  const classes = useStyles()

  return <>
    <main className={classes.main} >
      <UsersSearch />
    </main>
  </>
})

export default Users
