import MUILink from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import React from 'react'

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
  },
}))

export default (props) => {
  const classes = useStyles()
  const {
    className,
    href,
    hrefAs,
    children,
    target,
    color,
  } = props

  return (
    <>
    {
      href && href[0] === '/' && !target ?
      <Link href={href} as={hrefAs}>
        <MUILink color={color} className={`${classes.root} ${className}`}>
          {children}
        </MUILink>
      </Link>
        : <MUILink
        href={href}
        target={target}
        rel={target ? 'noopener' : ''}
        color={color}
        className={`${classes.root} ${className}`}
      >
        {children}
      </MUILink>
    }
    </>
  )
}
