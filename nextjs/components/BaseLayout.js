import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'

class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    subtitle: PropTypes.string.isRequired,
  }
  static async getInitialProps({ req }) {
    return {}
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  @autobind
  linkToTop(event) {
    Router.push({
      pathname: '/',
    })
  }
  @autobind
  linkTosSearch(event) {
    Router.push({
      pathname: '/search',
    })
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button raised color="accent" className={classes.title} onClick={this.linkToTop}>
              <Typography type="title" color="inherit" >
                {`${this.props.title}`}
              </Typography>
            </Button>
            <Typography type="subheading" color="inherit" className={classes.subtitle}>
              {`${this.props.subtitle}`}
            </Typography>
            <Button color="contrast" className={classes.searchButton} onClick={this.linkTosSearch}>検索</Button>
          </Toolbar>
        </AppBar>
        { this.props.children }
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    width: '100%',
  },
  title: {
    marginRight: '10px',
  },
  subtitle: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  searchButton: {
    'font-weight': 'bold',
  },
})

export default withStyles(styles)(PageComponent)
