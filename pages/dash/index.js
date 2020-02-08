import { withStyles } from '@material-ui/core/styles'
import { inject, observer } from 'mobx-react'
import { Component } from 'react'
import { IsLoggedIn } from '../../components/pages'
import { Dashboard } from '../../components/pages-dash'

const styles = (theme) => ({
  main: {
    paddingLeft: 200,
    paddingTop: 64,
    width: '100vw',

    '& > .MuiGrid-root': {
      width: '100%',
      margin: 0,
      padding: theme.spacing(2),
    },
  },
})

@IsLoggedIn
@inject('store')
@observer
class Dash extends Component {
  render() {
    const { classes, store } = this.props
    console.log('dash store', store)
    return (
      <main className={classes.main}>
        <Dashboard />
      </main>
    )
  }
}

export default withStyles(styles)(Dash)
