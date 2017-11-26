import React from 'react'
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

  static async apiTodolist(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/todolist?id=${id}`)
      const json = await response.json()
      return json
    } catch (error) {
      return []
    }
  }
  static async apiTodos(todolistId) {
    try {
      const response = await fetch(`http://localhost:3000/api/todos?todolist_id=${todolistId}`)
      const json = await response.json()
      return json
    } catch (error) {
      return []
    }
  }

  static async getInitialProps({ req, res }) {
    if (req && req.query && req.query.id) {
      const initDetailList = await this.apiTodolist(req.query.id)
      const initTodos = await this.apiTodos(req.query.id)
      if (initDetailList.length < 1) {
        res.statusCode = 404
        res.end('Not found')
        return
      }
      return { initDetailList, initTodos }
    }
  }

  constructor(props, context) {
    super(props, context)
    console.log(props.initDetailList)
    console.log(props.initTodos)
    this.state = {
      detailList: (props.initDetailList && props.initDetailList.length > 0) ? props.initDetailList[0] : null,
      todos: (props.initTodos && props.initTodos.length > 0) ? props.initTodos : null,
      todoName: '',
      todoLimit: moment().format('YYYY-MM-DD'),
    }
  }

  @autobind
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  @autobind
  addTodo(event) {
    const obj = {
      todolist_id: this.state.detailList.id,
      text: this.state.todoName,
      deadline_at: this.state.todoLimit,
    }
    const method = 'POST'
    const body = JSON.stringify(obj)
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    fetch('http://localhost:3000/api/add_todo', { method, headers, body })
      .then(async () => {
        const json = await this.constructor.apiTodos(this.state.detailList.id)
        this.setState({ todoName: '', todos: json })
      })
      .catch(console.error)
  }
  @autobind
  changeCompleat(data, index) {
    return async (event) => {
      const obj = {
        id: data.id,
        complete: !data.complete,
      }
      const method = 'PATCH'
      const body = JSON.stringify(obj)
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
      const response = await fetch('http://localhost:3000/api/change_todo', { method, headers, body })
      const json = await response.json()
      if (json.success) {
        this.state.todos[index].complete = obj.complete
        this.setState({ todos: this.state.todos })
      }
    }
  }


  render() {
    const { classes } = this.props
    { (() => { { if (!this.state.detailList) return 'null' } })() }
    return (
      <BaseLayout title="TODO" subtitle="TOP" className={classes.root}>
        <div className={classes.root}>
          <Typography type="title" className={classes.flex}>
            {this.state.detailList.title}
          </Typography>
          <form className={classes.flex} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  name="todoName"
                  label="ToDo名"
                  fullWidth
                  className={classes.flex}
                  value={this.state.todoName}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <TextField
                  name="todoLimit"
                  label="期限"
                  type="date"
                  fullWidth
                  className={classes.flex}
                  defaultValue={this.state.todoLimit}
                  onChange={this.handleChange}
                  InputLabelProps={{
                  shrink: true,
                }}
                />
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <Button raised color="primary" className={classes.widthButton} onClick={this.addTodo} >
                  追加
                </Button>
              </Grid>
            </Grid>
            <Typography type="caption" className={classes.flex}>
            エラーです
            </Typography>
          </form>

          {this.state.todos.map((data, index) => (
            <Card className={classes.todoCard} key={data.id}>
              <div className={classes.todoCardMain}>
                <CardHeader
                  className={classes.flex}
                  avatar={
                    <Avatar aria-label="Recipe" className={classes.avatar}>
                      り
                    </Avatar>
                  }
                  title={data.text}
                  subheader={`期限 : ${moment(data.deadline_at).format('YYYY/MM/DD')}`}
                />
                <CardActions disableActionSpacing>
                  <div className={classes.flexGrow} />
                  <Button raised={!data.complete} color="primary" onClick={this.changeCompleat(data, index)}>{!data.complete ? '完了' : '未完了に戻す'}</Button>
                </CardActions>
              </div>
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
  title: {
    marginRight: '10px',
  },
  subtitle: {
  },
  card: {
    marginBottom: '15px',
  },
  todoCard: {
    marginBottom: '15px',
  },
  todoCardMain: {
    display: 'flex',
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

export default mobxWithRoot(materialUiWithRoot(withStyles(styles)(PageComponent)))
