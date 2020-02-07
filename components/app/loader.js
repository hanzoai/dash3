import { useState } from 'react'
import classnames from 'classnames'
import { Typography } from '@material-ui/core'

export const startLoading = (...args) => {
}

export const stopLoading = (...args) => {
}

export const loadable = (WrappedComponent) => {
  const { props } = WrappedComponent
  const newProps = {}

  for (const key in props) {
    if (this.props.hasOwnProperty(key)) {
      newProps[key] = props[key]
    }
  }

  newProps.startLoading = startLoading
  newProps.stopLoading = stopLoading

  return <WrappedComponent {...newProps} />
}

export const Loader = (props) => {
  const [loading, setLoading] = useState(props.loading)
  const [unloading, setUnloading] = useState(props.unloading)
  const [msg, setMsg] = useState(props.msg)


  render() {
    const classes = ['app-loader', 'columns']
    if (loading)
      classes.push('loading')

    if (unloading)
      classes.push('unloading')
    
    return (
      <div className={classnames(...classes)}>
        {
          loading ?
          <div className={'content'}>
            <Typography variant='h4' className={'app-loader-message'}>{msg || 'Loading...'}</Typography>
          </div> : null
        }
      </div>
    )
  }
}
