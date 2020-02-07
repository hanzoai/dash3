import Router from 'next/router'
import { useEffect } from 'react'

export default (PageComponent) => (props) => {
  const { credentialStore } = props
  useEffect(() => {
    if (!credentialStore.isLoggedIn) {
      Router.push('/')
      return
    }

    if (!credentialStore.org) {
      credentialStore.getOrg()
        .then(() => {
          console.log('still logged in')
        }).catch((e) => {
          console.log('not logged in, logging out')

          credentialStore.logout()
          Router.push('/')
        })
    }
  }, [])

  return (
    <PageComponent {...props} />
  )
}
