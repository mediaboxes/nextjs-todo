import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

const styles = theme => ({
  root: {
    width: '100%',
  },
  title: {
    marginRight: '10px',
  },
  flex: {
    flex: 1,
  },
  searchButton: {
    'font-weight': 'bold',
  },
})

@withStyles(styles)
export default class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }
  static async getInitialProps({ req }) {
    return {}
  }

  @autobind
  static linkToTop(event) {
    Router.push({
      pathname: '/',
    })
  }
  @autobind
  static linkTosSearch(event) {
    Router.push({
      pathname: '/search',
    })
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }


  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button color="contrast" className={classes.title} onClick={this.constructor.linkToTop}>
              <Typography type="title" color="inherit" >
                {`${this.props.title}`}
              </Typography>
            </Button>
            <div className={classes.flex} />
            <Button raised color="accent" className={classes.searchButton} onClick={this.constructor.linkTosSearch}>検索</Button>
          </Toolbar>
        </AppBar>
        { this.props.children }
      </div>
    )
  }
}

