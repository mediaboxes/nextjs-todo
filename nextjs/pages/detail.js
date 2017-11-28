import React from 'react'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'
import ListIcon from 'material-ui-icons/List'
import green from 'material-ui/colors/green'

import BaseLayout from '../components/BaseLayout'
import CardTodoDataMain from '../components/CardTodoDataMain'
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'

import { apiTodolist, apiTodos, apiAddTodo, apiChangeCompleatTodo, apiDeleteTodo } from '../utils/todoApi'

import MessageTypography from '../components/MessageTypography'
import ErrorTypography from '../components/ErrorTypography'

const styles = theme => ({
  root: {
    padding: '20px',
  },
  title: {
    display: 'flex',
    'align-items': 'center',
  },
  listAvatar: {
    marginRight: '15px',
    color: '#fff',
    backgroundColor: green[300],
  },
  form: {
    marginBottom: '15px',
  },
  flex: {
    flex: 1,
  },
  alignSelfBaseline: {
    'align-self': 'baseline',
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

@withStyles(styles)
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
      todos: (props.initTodos) ? props.initTodos : [],
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

  @autobind
  deleteTodo(data) {
    return async (event) => {
      try {
        await apiDeleteTodo(data.id)
        const res = await apiTodos(this.state.detailList.id)
        this.setState({
          message: 'ToDoが削除されました', todos: res,
        })
      } catch (error) {
        this.setState({ error: error.message })
      }
    }
  }

  render() {
    const { classes } = this.props
    if (!this.state.detailList || !this.state.todos) return null
    return (
      <BaseLayout title="TODOリスト">
        <div className={classes.root}>
          <div className={classes.title}>
            <Avatar aria-label="Recipe" className={classes.listAvatar}>
              <ListIcon />
            </Avatar>
            <Typography type="title" className={classes.flex}>
              {this.state.detailList.title}
            </Typography>
          </div>
          <form className={`${classes.flex} ${classes.form}`} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={9} className={classes.alignSelfBaseline}>
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
              <Grid item xs={12} sm={3} className={classes.alignSelfBaseline}>
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
            <CardTodoDataMain key={data.id} data={data} changeCompleat={this.changeCompleat(data, index)} deleteTodo={this.deleteTodo(data)} />
          ))}
        </div>
      </BaseLayout>
    )
  }
}


export default mobxWithRoot(materialUiWithRoot(PageComponent))
