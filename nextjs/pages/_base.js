import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import AccountCircle from 'material-ui-icons/AccountCircle'
import Switch from 'material-ui/Switch'
import { FormControlLabel, FormGroup } from 'material-ui/Form'
import Menu, { MenuItem } from 'material-ui/Menu'
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
})

class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }
  static async getInitialProps({ req }) {
    // const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return {}
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      anchorEl: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    // const { pathname, query } = nextProps.url
  }
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root} />
    )
  }
}


export default withStyles(styles)(PageComponent)
