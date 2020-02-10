import { withStyles } from '@material-ui/styles'
import { inject, observer } from 'mobx-react'
import { Component } from 'react'
import { IsLoggedIn } from '../../components/pages'
import { ProductsSearch } from '../../components/pages-dash'

const styles = () => ({
  products: {
    paddingLeft: '200px',
    paddingTop: '80px',
    width: '100vw',
    'products-search-form': {
      padding: '0 8px',
      width: '100%',
      margin: 0,
    },
    'MuiExpansionPanelDetails-root': {
      flexDirection: 'column',
    },
    table: {
      width: '100%',
      'MuiTablePagination-root': {
        border: 0,
      },
      'MuiPaper-root': {
        boxShadow: 'none',
        borderRadius: 0,
        '& > div': {
          overflow: 'initial !important',
          '& > div > div': {
            overflow: 'initial !important',
          },
        },
      },
      th: {
        top: '64px',
        position: 'sticky',
      },
    },
  },
})

@IsLoggedIn
@inject('store')
@observer
class Products extends Component {
  render() {
    const { classes } = this.props
    return (
      <main className={classes.products}>
        <ProductsSearch />
      </main>
    )
  }
}

export default withStyles(styles)(Products)
