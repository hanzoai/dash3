import NF from 'react-number-format'
import { signs } from '../../src/currency'

export const CreateCurrencyFormat = (currency) => (
  (props) => {
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
)

export const NumberFormat = (props) => {
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
    />
  )
}

export default () => {}
