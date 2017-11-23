import React from 'react'
import Router from 'next/router'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from 'material-ui-icons/Favorite'
import ShareIcon from 'material-ui-icons/Share'
import 'isomorphic-fetch'
import BaseLayout from '../components/BaseLayout'

class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  static async getInitialProps({ req }) {
    const response = await fetch('http://localhost:3000/api/todoList')
    const json = await response.json()
    console.log(json)
    return { lists: json }
  }

  constructor(props, context) {
    super(props, context)
    // console.log(props.lists)
    this.state = {
      name: '',
    }
  }

  handleChange(name) {
    return (event) => {
      this.setState({ [name]: event.value })
    }
  }
  @autobind
  addTodoList(event) {
    console.log(event)
  }

  @autobind
  linkToDetail(event) {
    Router.push({
      pathname: '/detail',
      query: { id: 1 },
    })
  }

  render() {
    const { classes } = this.props
    return (
      <BaseLayout title="TODO" subtitle="TOP">
        <div className={classes.root}>
          <Typography type="title" className={classes.flex}>
          新しいToDoを作成する
          </Typography>
          <form className={classes.flex} noValidate autoComplete="off" onSubmit={this.addTodoList} >
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  label="追加リスト名"
                  fullWidth
                  className={classes.flex}
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <Button raised color="primary" className={classes.widthButton} onClick={this.linkToDetail}>
                追加
                </Button>
              </Grid>
            </Grid>
            <Typography type="caption" className={classes.flex}>
            エラーです
            </Typography>
          </form>

          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                り
                </Avatar>
            }
              title={
                <Button color="primary" className={classes.widthButton} onClick={this.linkToDetail}>
                  <span className={classes.textAlignLeft}>タイトル</span>
                </Button>
              }
              subheader="September 14, 2016"
            />
            <CardContent>
              <Typography component="p">
              This impressive paella is a perfect party dish and a fun meal to cook together with
              your guests. Add 1 cup of frozen peas along with the mussels, if you like.
              </Typography>
            </CardContent>
            <CardActions disableActionSpacing>
              <div className={classes.flexGrow} />
              <IconButton aria-label="Add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="Share">
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        </div>
      </BaseLayout>
    )
  }
}

const styles = theme => ({
  root: {
    padding: '20px',
  },
  title: {
    marginRight: '10px',
  },
  subtitle: {
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  alignSelfBaseline: {
    'align-self': 'baseline',
  },
  textAlignLeft: {
    'text-align': 'left',
    width: '100%',
  },
  widthButton: {
    width: '100%',
    padding: '0',
  },
})

export default withStyles(styles)(PageComponent)
