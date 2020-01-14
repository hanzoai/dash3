import React from 'react'
import classnames from 'classnames'

export let startLoading = (...args) => {
}

export let stopLoading = (...args) => {
}

// catch any loading commands before initial render
let loading = true
let msg = ''

export let loadable = (WrappedComponent) => {
  class LoadableComponent extends React.Component {
    render() {
      let props = this.props
      let newProps = {}

      for (let key in props) {
        if (this.props.hasOwnProperty(key)) {
          newProps[key] = props[key]
        }
      }

      newProps.startLoading = startLoading
      newProps.stopLoading = stopLoading

      return <WrappedComponent {...newProps} />
    }
  }

  return LoadableComponent
}

export default class Loader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: loading,
      unloading: false,
      msg: msg,
    }
  }

  render() {
    return pug`
      .app-loader.columns(
        className=classnames({
          loading: this.state.loading,
          unloading: this.state.unloading,
        })
      )
        if this.state.loading
          .content
            h4.app-loader-message
              = this.state.msg || 'Loading...'
      `
  }
}
