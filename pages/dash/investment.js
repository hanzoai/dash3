import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'
import InvestmentForm from '../../components/pages-dash/pages-investments/InvestmentForm'

import css from 'styled-jsx/css'

@isLoggedIn
@inject("store")
@observer
class Investment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      create: false,
    }
  }

  componentDidMount() {
    let id = this.props.router.query.id
    // if there is an id then start in normal mode
    if (id) {
      this.props.store.investmentsStore.getInvestment(id).catch((e) => {
        console.log('investment page error', e)
        Router.push('/dash')
      })
    } else {
      this.setState({ create: true })
    }
  }

  render() {
    return <> {
      pug`
        main#dash.investment
          InvestmentForm(doCreate=this.state.create)
      `}
      <style jsx global>{`
        #dash.investment
          padding-left: 200px
          padding-top: 80px
          width: 100vw

          & > *
            margin: 0px
            padding: 8px
      `}</style>
    </>
  }
}

export default withRouter(Investment)
