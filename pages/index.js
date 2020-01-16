import { Component } from 'react'

import Router from 'next/router'
import { inject, observer } from 'mobx-react'

import { isLoggedOut } from '../components/pages'
import LoginForm from '../components/pages-login/LoginForm'

import {
  Card,
  CardContent,
  Grid,
} from '@material-ui/core'

import css from 'styled-jsx/css'

import logoImg from '../assets/images/logo-dark.svg'

@isLoggedOut
@inject("store")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
  }

  onLogin() {
    Router.push('/dash')
  }

  render() {
    return <> {
      pug`
        main#index
          Grid.container(container justify='center' alignItems='center')
            Grid(item xs=12 sm=4)
              Card.card
                CardContent
                  img.logo(src=logoImg)
                  br
                  br
                  LoginForm(
                    onLogin=this.onLogin
                  )
      `}
      <style jsx global>{`
        #index
          background-color: #1a237e
          background-position: center
          background-size: cover

          .logo
            max-height: 100px

          .container
            min-height: 100vh
            height: auto
            padding: 0
            text-align: center

          .card
            background-color: rgba(255,255,255,0.8)

          .checkbox
            justify-content: center
      `}</style>
    </>
  }
}

export default Index
