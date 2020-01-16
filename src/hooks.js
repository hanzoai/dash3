import midstream from 'midstream'
import { useEffect, useState } from 'react'

export const useMidstream = (config, opts) => {
  const dst = opts.dst || {}
  const err = opts.err || {}

  // standard force rerender hack
  const [, setTick] = useState(0)

  const [ms] = useState(() => {
    let tick = 0

    return midstream(config, {
      dst: (name, value) => {
        dst[name] = value
        setTick(tick++)
      },
      // err behaves just like dst
      err: (name, value) => {
        err[name] = value
        setTick(tick++)
      },
    })
  })

  const ret = { ...ms }

  return Object.assign(ret, {
    get dst() {
      return dst
    },
    get err() {
      return err
    },
  })
}

export const foo = 1
