import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}))

export default (props) => {
  const classes = useStyles()
  const {
    disabled,
    id,
    value,
    onChange,
  } = props

  return (
    <FormControl className={classes.grow}>
      <Select
        labelId={id}
        id={`${id}-select`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <MenuItem value='day'>Last Day</MenuItem>
        <MenuItem value='7days'>Last 7 Days</MenuItem>
        <MenuItem value='month'>This Month</MenuItem>
        <MenuItem value='30days'>Last 30 Days</MenuItem>
        <MenuItem value='alltime'>All Time</MenuItem>
      </Select>
    </FormControl>
  )
}
