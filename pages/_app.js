import React from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'

import {
  Drawer,
  Footer,
  Header,
} from '../components/layout'

import NoSsr from '@material-ui/core/NoSsr'
import CssBaseline from "@material-ui/core/CssBaseline"

import {
  Provider,
  observer
} from 'mobx-react'

import initStore from '../stores'

import {
  blue,
  yellow,
} from '@material-ui/core/colors'

import {
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles'

import 'reeeset/src/reeeset.css'
import 'flag-icon-css/css/flag-icon.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import '../styles.styl'

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: yellow[800],
      contrastText: '#FFF',
    },
    background: {
      paper: '#FAFAFA',
    },
  },
})

@observer
class MyApp extends App {
  static async getInitialProps(appContext) {
    //
    // Use getInitialProps as a step in the lifecycle when
    // we can initialize our store (nextJS DOCS)
    //

    let pageProps = {}

    const appProps = await App.getInitialProps(appContext)
    pageProps = appProps.pageProps

    const isServer = typeof window === 'undefined'
    const data = initStore()

    console.log('data', data)

    return {
      pageProps,
      data,
    }
  }

  constructor(props) {
    super(props)

    // this needs to be calculated in situ because it can be run on both server
    // and client
    const isServer = typeof window === 'undefined'

    this.store = isServer
      ? props.data
      : initStore(props.data)

    console.log('store', props.isServer, this.store)
  }

  // componentDidMount() {
  //   stopLoading()
  // }

  render () {
    const { Component, pageProps } = this.props


    return pug`
      MuiThemeProvider(theme=theme)
        CssBaseline
        NoSsr
          Provider(store=this.store)
            Header(singleSubmit=false)
            Drawer(variant='permanent')
            Component
            Footer
    `
  }

  componentDidCatch (error, errorInfo) {
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

export default MyApp
