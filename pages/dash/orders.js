import { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { IsLoggedIn } from '../../components/pages'
import { OrdersSearch } from '../../components/pages-dash'

import {
  Grid,
  Typography,
  LinearProgress,
} from '@material-ui/core'

import css from 'styled-jsx/css'
import capitalize from '../../src/string/capitalize'

@IsLoggedIn
@inject("store")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <> {
      pug`
        main#dash.orders
          OrdersSearch
      `}
      <style jsx global>{`
        #dash.orders
          padding-left: 200px
          padding-top: 80px
          width: 100vw

          .orders-search-form
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
