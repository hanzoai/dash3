import React from 'react'

import MUILink from '@material-ui/core/Link'
import Link from 'next/link'

import { withStyles } from '@material-ui/core/styles'

class MyLink extends React.Component {
  render() {
    const { style, className, classes, href, hrefAs, children, target, ...props } = this.props
    return pug`
      if (href && href[0] == '/' && !target)
        Link(
          href=href
          as=hrefAs
        )
          MUILink(
            ...props
            className=classes.root + ' ' + className
          )
            =children
      else
        MUILink(
          ..props
          href=href
          target=target
          rel=target ? 'noopener' : ''
          className=classes.root + ' ' + className
        )
          =children
    `
  }
}

let styles = theme => ({
  root: {
    cursor: 'pointer',
  },
})

export default withStyles(styles)(MyLink)
