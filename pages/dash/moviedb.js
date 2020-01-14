import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'

import css from 'styled-jsx/css'

@isLoggedIn
@inject("store")
@observer
class MovieDB extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <> {
      pug`
        main#dash.movie-db
          iframe(src='https://files.hanzo.ai:444/browser/#')
      `}
      <style jsx global>{`
        #dash.movie-db
          padding-left: 200px
          padding-top: 30px
          width: 100vw

          & > *
            border: 0
            width: 100%
            height: calc(100vh - 30px)
      `}</style>
    </>
  }
}

export default withRouter(MovieDB)
