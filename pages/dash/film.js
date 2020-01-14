import { Component } from 'react'

import Router, { withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { isLoggedIn } from '../../components/pages'
import FilmForm from '../../components/pages-dash/pages-films/FilmForm'

import css from 'styled-jsx/css'

@isLoggedIn
@inject("store")
@observer
class Film extends Component {
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
      this.props.store.filmsStore.getFilm(id).catch((e) => {
        console.log('film page error', e)
        Router.push('/dash')
      })
    } else {
      this.setState({ create: true })
    }
  }

  render() {
    return <> {
      pug`
        main#dash.film
          FilmForm(doCreate=this.state.create)
      `}
      <style jsx global>{`
        #dash.film
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

export default withRouter(Film)
