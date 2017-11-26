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
import { CircularProgress } from 'material-ui/Progress'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from 'material-ui-icons/Favorite'
import ShareIcon from 'material-ui-icons/Share'
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank'
import CheckBox from 'material-ui-icons/CheckBox'

import 'isomorphic-fetch'

import BaseLayout from '../components/BaseLayout'
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'

import { apiTodolist, apiTodos, apiAddTodo, apiChangeCompleatTodo } from '../utils/todoApi'

import MessageTypography from '../components/MessageTypography'
import ErrorTypography from '../components/ErrorTypography'

class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  static async getInitialProps({ query, res }) {
    const initProps = {}
    if (query && query.id) {
      initProps.detailListId = query.id
      try {
        const initTodoDetailList = await apiTodolist(query.id)
        if (initTodoDetailList.length < 1) {
          res.statusCode = 404
          res.end('Not found')
          return {}
        }
        const initTodos = await apiTodos(query.id)
        initProps.initTodoDetailList = initTodoDetailList
        initProps.initTodos = initTodos
      } catch (error) {
        initProps.initError = error.message
      }
    }
    return initProps
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      detailList: (props.initTodoDetailList && props.initTodoDetailList.length > 0) ? props.initTodoDetailList[0] : null,
      todos: props.initTodos,
      todoName: '',
      todoLimit: moment().format('YYYY-MM-DD'),
      message: '',
      error: props.initError,
      addApiLoading: false,
    }
    if (!props.initTodoDetailList) {
      apiTodolist(props.detailListId)
        .then((initTodoDetailList) => {
          this.setState({
            detailList: initTodoDetailList,
          })
        })
    }
    if (!props.initTodos) {
      apiTodos(props.detailListId)
        .then((initTodos) => {
          this.setState({
            todos: initTodos,
          })
        })
    }
  }

  @autobind
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  @autobind
  async addTodo(event) {
    this.setState({ message: '', error: '', addApiLoading: true })
    try {
      await apiAddTodo(this.state.detailList.id, this.state.todoName, this.state.todoLimit)
      const res = await apiTodos(this.state.detailList.id)
      this.setState({
        todoName: '', message: '新しいToDoが作成されました', todos: res, addApiLoading: false,
      })
    } catch (error) {
      this.setState({ error: error.message, addApiLoading: false })
    }
  }

  @autobind
  changeCompleat(data, index) {
    return async (event) => {
      try {
        await apiChangeCompleatTodo(data.id, !data.complete)
        this.state.todos[index].complete = !data.complete
        this.setState({ todos: this.state.todos })
      } catch (error) {
        this.setState({ error: error.message })
      }
    }
  }

  render() {
    const { classes } = this.props
    if (!this.state.detailList || !this.state.todos) return null
    return (
      <BaseLayout title="TODO" subtitle="新しいToDoを作成する" className={classes.root}>
        <div className={classes.root}>
          <Typography type="title" className={classes.flex}>
            {this.state.detailList.title}
          </Typography>
          <form className={`${classes.flex} ${classes.form}`} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  name="todoName"
                  label="新しいToDo名を入力してください"
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
                <div className={classes.wrapper}>
                  <Button
                    raised
                    color="primary"
                    className={classes.widthButton}
                    disabled={this.state.addApiLoading}
                    onClick={this.addTodo}
                  >
                    ToDoの追加
                  </Button>
                  {this.state.addApiLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </Grid>
            </Grid>
          </form>
          <MessageTypography message={this.state.message} />
          <ErrorTypography errorMessage={this.state.error} />
          <ErrorTypography errorMessage={(!this.state.todos || this.state.todos.length < 1) ? '登録されたToDoはございません' : null} />

          {this.state.todos.map((data, index) => (
            <Card className={classes.todoCard} key={data.id}>
              <div className={classes.todoCardMain}>
                <CardHeader
                  className={classes.flex}
                  avatar={
                    <Avatar aria-label="Recipe" className={classes.avatar}>
                      {data.complete ? <CheckBox /> : <CheckBoxOutlineBlank />}
                    </Avatar>
                  }
                  title={data.text}
                />
                <CardActions disableActionSpacing>
                  <div className={classes.flexGrow} />
                  <Button raised={!data.complete} color="primary" onClick={this.changeCompleat(data, index)}>{!data.complete ? '完了' : '未完了に戻す'}</Button>
                </CardActions>
              </div>
              <CardContent>
                <Typography component="p">
                  {`期限 : ${moment(data.deadline_at).format('YYYY年MM月DD日')}`}<br />
                  {`作成日 : ${moment(data.created_at).format('YYYY年MM月DD日')}`}
                </Typography>
              </CardContent>
              {/* <CardActions disableActionSpacing>
                <div className={classes.flexGrow} />
                <IconButton aria-label="Add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="Share">
                  <ShareIcon />
                </IconButton>
              </CardActions> */}
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
  form: {
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
    'text-transform': 'none',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

export default mobxWithRoot(materialUiWithRoot(withStyles(styles)(PageComponent)))
