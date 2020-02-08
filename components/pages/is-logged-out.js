import Router from 'next/router'
import { useEffect } from 'react'

import { useStore } from '../../stores'

export default (PageComponent) => (props) => {
  const store = useStore()
  const { credentialStore } = store
  useEffect(() => {
    if (credentialStore && credentialStore.isLoggedIn) {
      Router.push('/dash')
    }
  }, [])

  return (
    <PageComponent {...props} />
  )
}
