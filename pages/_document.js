import React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'

export default class MyDocument extends Document {
  // getChildContext() {
  //   return {
  //     _documentProps: this.props,
  //     _devOnlyInvalidateCacheQueryString: '',
  //   }
  // }

  render() {
    const { pageContext } = this.props

    return (
      <Html
        lang='en'
        dir='ltr'
      >
        <Head>
          <title>Hanzo Admin</title>
          <meta charSet='utf-8'/>
          <meta
            httpEquiv='x-ua-compatible'
            content='ie=edge'
          />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
          />
          <meta
            name='msapplication-tap-highlight'
            content='no'
          />
          {/* <link
            rel='manifest'
            href='/static/manifest.json'
          /> */}
          <link
            rel='icon'
            type='image/png'
            href='/static/favicon.ico'
          />
          <script dangerouslySetInnerHTML={
            {
              __html: `;(function(w, d, s, g, js, fjs) {
              g = w.gapi || (w.gapi = {})
              g.analytics = {
                q: [],
                ready: function(cb) {
                  this.q.push(cb)
                }
              }
              js = d.createElement(s)
              fjs = d.getElementsByTagName(s)[0]
              js.src = "https://apis.google.com/js/platform.js"
              fjs.parentNode.insertBefore(js, fjs)
              js.onload = function() {
                g.load("analytics")
              }
            })(window, document, "script")`,
            }} />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}
