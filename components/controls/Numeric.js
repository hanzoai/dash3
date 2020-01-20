import NF from 'react-number-format'
import { signs } from '../../src/currency'

export const CreateCurrencyFormat = (currency) => {
  return (props) => {
    const {
      inputRef,
      onBlur,
      onChange,
      onFocus,
      value,
      ...other
    } = props

    return (
      <NF
        {...other}
        getInputRef={inputRef}
        onBlur={onBlur}
        isNumericString
        prefix={signs[currency || '']}
      />
    )
  }
}

export const NumberFormat = (props) => {
  const { inputRef, onBlur, ...other } = props

  return (
    <NF
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        const n = parseFloat(values.value)
        onBlur({
          target: {
            value: Number.isNaN(n) ? 0 : n,
          },
        })
      }}
      isNumericString
    />
  )
}

export default () => {}
