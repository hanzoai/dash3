import { GoogleDataChart, GoogleProvider } from 'react-analytics-widget'

const CLIENT_ID = '90331516296-63tkkvjin9pvatresn5tootaorsr1c7p.apps.googleusercontent.com'

const last7days = {
  reportType: 'ga',
  query: {
    dimensions: 'ga:date',
    metrics: 'ga:pageviews',
    'start-date': '7daysAgo',
    'end-date': 'yesterday',
  },
  chart: {
    type: 'LINE',
  },
}

// analytics views ID
const views = {
  query: {
    ids: 'ga:173748040',
  },
}

const Example = () => (
  <GoogleProvider clientId={CLIENT_ID}>
    <GoogleDataChart views={views} config={last7days} />
  </GoogleProvider>
)

export default Example
