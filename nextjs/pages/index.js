import React from 'react'
import Router from 'next/router'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'

import BaseLayout from '../components/BaseLayout'
import CardTodoListMain from '../components/CardTodoListMain'
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'
import { apiTodolists, apiAddTodoList, apiDeleteTodoList } from '../utils/todoApi'

import MessageTypography from '../components/MessageTypography'
import ErrorTypography from '../components/ErrorTypography'


const styles = theme => ({
  root: {
    padding: '20px',
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  form: {
    marginBottom: '15px',
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

  static async getInitialProps({ req }) {
    const initProps = {}
    try {
      const res = await apiTodolists()
      initProps.initLists = res
    } catch (error) {
      initProps.initError = error.message
    }
    return initProps
  }

  static linkToDetail(id) {
    return (event) => {
      Router.push({
        pathname: '/detail',
        query: { id },
      })
    }
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      title: '',
      lists: (props.initLists) ? props.initLists : [],
      message: '',
      error: props.initError,
      addApiLoading: false,
    }
  }

  handleChange(name) {
    return (event) => {
      this.setState({ [name]: event.target.value })
    }
  }

  @autobind
  async addTodoList() {
    this.setState({ message: '', error: '', addApiLoading: true })
    try {
      await apiAddTodoList(this.state.title)
      const res = await apiTodolists()
      this.setState({
        title: '', message: '新しいToDoリストが作成されました', lists: res, addApiLoading: false,
      })
    } catch (error) {
      this.setState({ error: error.message, addApiLoading: false })
    }
  }

  @autobind
  deleteTodoList(data) {
    return async (event) => {
      try {
        await apiDeleteTodoList(data.id)
        const res = await apiTodolists()
        this.setState({
          message: 'ToDoリストが削除されました', lists: res,
        })
      } catch (error) {
        this.setState({ error: error.message })
      }
    }
  }

  render() {
    const { classes } = this.props
    return (
      <BaseLayout title="TODOリスト">
        <div className={classes.root}>
          <form className={`${classes.flex} ${classes.form}`} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }} >
            <Grid container spacing={24}>
              <Grid item xs={12} sm={9} className={classes.alignSelfBaseline}>
                <TextField
                  label="新しいToDoリスト名を入力してください"
                  fullWidth
                  className={classes.flex}
                  onChange={this.handleChange('title')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={3} className={classes.alignSelfBaseline}>
                <div className={classes.wrapper}>
                  <Button
                    raised
                    color="primary"
                    className={classes.widthButton}
                    disabled={this.state.addApiLoading}
                    onClick={this.addTodoList}
                  >
                    ToDoリストの作成
                  </Button>
                  {this.state.addApiLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </Grid>
            </Grid>
          </form>

          <MessageTypography message={this.state.message} />
          <ErrorTypography errorMessage={this.state.error} />

          {this.state.lists.map(data => (
            <CardTodoListMain data={data} key={data.id} linkToDetail={this.constructor.linkToDetail(data.id)} deleteTodoList={this.deleteTodoList(data)} />
          ))}
        </div>
      </BaseLayout>
    )
  }
}


export default mobxWithRoot(materialUiWithRoot(PageComponent))
