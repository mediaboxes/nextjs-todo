import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
})

class Component extends React.Component {
  static propTypes = {
    errorMessage: PropTypes.string,
  }
  render() {
    const { classes } = this.props
    if (!this.props.errorMessage) {
      return null
    }
    return (
      <Typography type="subheading" className={`${classes.flex} ${classes.error}`}>
        {this.props.errorMessage}
      </Typography>
    )
  }
}


export default withStyles(styles)(Component)
