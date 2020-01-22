import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'
import { ProductForm } from '../../components/pages-dash'

import css from 'styled-jsx/css'

@isLoggedIn
@inject("store")
@observer
class Product extends Component {
  constructor(props) {
    super(props)

    this.state = {
      create: !props.router.query.id,
    }
  }

  componentDidMount() {
    let id = this.props.router.query.id

    if (!id && typeof window !== 'undefined') {
      let params = new URLSearchParams(window.location.search)
      id = params.get('id')
    }

    // if there is an id then start in normal mode
    if (id) {
      this.props.store.productsStore.getProduct(id).catch((e) => {
        console.log('product page error', e)
        Router.push('/dash')
      })
    } else {
      this.setState({ create: true })
    }
  }

  render() {
    return <> {
      pug`
        main#dash.product
          ProductForm(doCreate=this.state.create)
      `}
      <style jsx global>{`
        #dash.product
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

export default withRouter(Product)
