import { withStyles } from '@material-ui/styles'
import { inject, observer } from 'mobx-react'
import Router, { withRouter } from 'next/router'
import { Component } from 'react'
import { IsLoggedIn } from '../../components/pages'
import { ProductForm } from '../../components/pages-dash'

const styles = () => ({
  product: {
    paddingLeft: '200px',
    paddingTop: '80px',
    width: '100vw',
    '& > *': {
      margin: '0px',
      padding: '8px',
    },
  },
})

@IsLoggedIn
@inject('store')
@observer
class Product extends Component {
  constructor(props) {
    super(props)

    this.state = {
      create: false,
    }
  }

  componentDidMount() {
    const { router, store } = this.props
    let { id } = router.query
    const { ordersStore } = store

    if (!id && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      id = params.get('id')
    }

    // if there is an id then start in normal mode
    if (id) {
      ordersStore.getOrder(id).catch((e) => {
        console.log('order page error', e)
        Router.push('/dash')
      })
    } else {
      this.setState({ create: true })
    }
  }

  render() {
    const { classes } = this.props
    const { create } = this.state
    return (
      <main className={classes.product}>
        <ProductForm doCreate={create} />
      </main>
    )
  }
}

export default withRouter(withStyles(styles)(Product))
