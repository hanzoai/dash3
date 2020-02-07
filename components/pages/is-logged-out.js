import Router from 'next/router'
import { useEffect } from 'react'

export default (PageComponent) => (props) => {
  const { credentialStore } = props
  useEffect(() => {
    if (credentialStore && credentialStore.isLoggedIn) {
      Router.push('/dash')
    }
  }, [])

  return (
    <PageComponent {...props} />
  )
}
