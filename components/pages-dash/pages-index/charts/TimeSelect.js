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
        <MenuItem value={0}>Last 7 Days</MenuItem>
        <MenuItem value={1}>Last Day</MenuItem>
        <MenuItem value={2}>This Month</MenuItem>
        <MenuItem value={3}>Last 30 Days</MenuItem>
        <MenuItem value={4}>All Time</MenuItem>
      </Select>
    </FormControl>
  )
}
