import { withStyles } from '@material-ui/styles'
import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { IsLoggedIn } from '../../components/pages'
import { UserForm } from '../../components/pages-dash'

const styles = () => ({
  user: {
    paddingLeft: '200px',
    paddingTop: '80px',
    width: '100vw',
    '& > *': {
      width: '100%',
      margin: '0px',
      padding: '8px',
    },
  },
})

@IsLoggedIn
@inject('store')
@observer
class User extends Component {
  constructor(props) {
    super(props)

    this.state = {
      create: false,
    }
  }

  componentDidMount() {
    const { router, store } = this.props
    let { id } = router.query
    const { usersStore } = store

    if (!id && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      id = params.get('id')
    }

    // if there is an id then start in normal mode
    if (id) {
      usersStore.getUser(id).catch((e) => {
        console.log('user page error', e)
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
      <main className={classes.user}>
        <UserForm doCreate={create} />
      </main>
    )
  }
}

export default withRouter(withStyles(styles)(User))
