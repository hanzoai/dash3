import { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'
import UsersSearch from '../../components/pages-dash/pages-users/UsersSearch'

import {
  Grid,
  Typography,
  LinearProgress,
} from '@material-ui/core'

import css from 'styled-jsx/css'
import capitalize from '../../src/string/capitalize'

@isLoggedIn
@inject("store")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <> {
      pug`
        main#dash.users
          UsersSearch
      `}
      <style jsx global>{`
        #dash.users
          padding-left: 200px
          padding-top: 80px
          width: 100vw

          .users-search-form
            padding: 0 8px
            width: 100%
            margin: 0


          .MuiExpansionPanelDetails-root
            flex-direction: column

          .table
            width: 100%

            .MuiTablePagination-root
              border: 0

            .MuiPaper-root
              box-shadow: none
              border-radius: 0

              & > div
                overflow: initial !important

                & > div > div
                  overflow: initial !important

            th
              top: 64px
              position: sticky
      `}</style>
    </>
  }
}

export default Index
