import {
  cyan,
  indigo,
  red,
} from '@material-ui/core/colors'

import CssBaseline from '@material-ui/core/CssBaseline'
import NoSsr from '@material-ui/core/NoSsr'

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from '@material-ui/core/styles'

import {
  Provider,
} from 'mobx-react'

import App from 'next/app'
import React from 'react'

import {
  Drawer,
  Footer,
  Header,
} from '../components/layout'

import {
  StoreProvider,
  initStore,
} from '../stores'

import 'reeeset/src/reeeset.css'
import 'flag-icon-css/css/flag-icon.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: indigo[900],
    },
    secondary: {
      main: cyan[500],
      contrastText: '#FFF',
    },
    background: {
      paper: '#FAFAFA',
    },
  },
})

const styles = {
  component: {
    '& .error': {
      color: red[500],
    },
    '& .control': {
      width: '100%',

      '& > *': {
        width: '100%',
      },
    },
  },
}

class MyApp extends App {
  static async getInitialProps(appContext) {
    //
    // Use getInitialProps as a step in the lifecycle when
    // we can initialize our store (nextJS DOCS)
    //

    let pageProps = {}

    const appProps = await App.getInitialProps(appContext)
    pageProps = appProps.pageProps

    return {
      pageProps,
    }
  }

  render() {
    const { Component, classes } = this.props

    const isServer = typeof window === 'undefined'
    let isIndex = true

    if (!isServer) {
      isIndex = window.location.pathname === '/'
    }

    const store = initStore()

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <NoSsr>
          <Provider store={store}>
            <StoreProvider>
              <div className={classes.component}>
                { !isIndex
                  && <>
                    <Header singleSubmit={false} />
                    <Drawer />
                  </>
                }
                <Component/>
                {/* !isIndex
                  && <Footer/>
                */}
              </div>
            </StoreProvider>
          </Provider>
        </NoSsr>
      </MuiThemeProvider>
    )
  }

  componentDidCatch(error, errorInfo) {
    console.log('CUSTOM ERROR HANDLING', error)
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo)
  }
}

// Router.events.on('routeChangeStart', () => {
//   startLoading()
// })

// Router.events.on('routeChangeComplete', () => {
//   stopLoading()
// })

// Router.events.on('routeChangeError', () => {
//   stopLoading()
// })

export default withStyles(styles)(MyApp)
