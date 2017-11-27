import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  message: {
    marginBottom: '15px',
  },
})

@withStyles(styles)
export default class Component extends React.Component {
  static propTypes = {
    message: PropTypes.string,
  }
  render() {
    const { classes } = this.props
    if (!this.props.message) {
      return null
    }
    return (
      <Typography type="title" className={`${classes.flex} ${classes.message}`}>
        {this.props.message}
      </Typography>
    )
  }
}

