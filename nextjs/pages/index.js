import React from 'react'
import Router from 'next/router'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import moment from 'moment'
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
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'

class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }


  static async apiTodolist() {
    const response = await fetch('http://localhost:3000/api/todolist')
    const json = await response.json()
    return json
  }
  static async getInitialProps({ req }) {
    const json = await this.apiTodolist()
    return { initLists: json }
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      title: '',
      lists: props.initLists,
    }
  }

  handleChange(name) {
    return (event) => {
      this.setState({ [name]: event.target.value })
    }
  }
  @autobind
  addTodoList(event) {
    const obj = { title: this.state.title }
    const method = 'POST'
    const body = JSON.stringify(obj)
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    fetch('http://localhost:3000/api/add_todolist', { method, headers, body })
      .then(async (res) => {
        res.json()
        const json = await this.constructor.apiTodolist()
        this.setState({ title: '', lists: json })
      })
      .then(console.log)
      .catch(console.error)
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
          <form className={classes.flex} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }} >
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  label="追加リスト名"
                  fullWidth
                  className={classes.flex}
                  onChange={this.handleChange('title')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <Button raised color="primary" className={classes.widthButton} onClick={this.addTodoList}>
                追加
                </Button>
              </Grid>
            </Grid>
            <Typography type="caption" className={classes.flex}>
            エラーです
            </Typography>
          </form>

          {this.state.lists.map(data => (
            <Card className={classes.card} key={data.id}>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    り
                  </Avatar>
                }
                title={
                  <Button color="primary" className={classes.widthButton} onClick={this.linkToDetail}>
                    <span className={classes.textAlignLeft}>{data.title}</span>
                  </Button>
                }
                subheader={moment(data.created_at).format('YYYY/MM/DD HH:mm')}
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
          ))}
        </div>
      </BaseLayout>
    )
  }
}

const styles = theme => ({
  root: {
    padding: '20px',
  },
  card: {
    marginBottom: '15px',
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
    'text-transform': 'none',
  },
})

export default mobxWithRoot(materialUiWithRoot(withStyles(styles)(PageComponent)))
