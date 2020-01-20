export default (theme) => ({
  searchForm: {
    position: 'sticky',
    top: 64,
    zIndex: 1000,
    background: theme.palette.background.paper,
    paddingTop: 16,
    marginTop: -16,
  },
  searchLine: {
    margin: 0,
    padding: '0 16px 8px',
    width: '100%',

    '& .control': {
      transform: 'translateY(2px)',
    },
  },
  table: {
    '& .MuiToolbar-root': {
      marginBottom: '-8px',
    },

    '& .MuiTableCell-root': {
      maxWidth: '250px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  expand: {
    borderRadius: '0 !important',
  },
})
