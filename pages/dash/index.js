import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { isLoggedIn } from '../../components/pages'
import { UsersSearch } from '../../components/pages-dash'

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: 200,
    paddingTop: 80,
    width: '100vw',

    '& .users-serach-form': {
      padding: [0, theme.spacing(1)],
      width: '100%',
      margin: 0,
    },

    '& .MuiExpansionPanelDetails-root': {
      flexDirection: 'column',
    },

    '& .table': {
      width: '100%',

      '& .MuiTablePagination-root': {
        border: 0,
      },

      '& .MuiPaper-root': {
        boxShadow: 'none',
        borderRadius: 0,

        '& > div': {
          overflow: 'initial !important',
        },

        '& > div > div': {
          overflow: 'initial !important',
        },
      },

      '& th': {
        top: theme.spacing(8),
        position: 'sticky',
      },
    },
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
