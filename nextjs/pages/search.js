import React from 'react'
import Router from 'next/router'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import 'isomorphic-fetch'

import BaseLayout from '../components/BaseLayout'
import CardTodoListSearch from '../components/CardTodoListSearch'
import CardTodoDataSearch from '../components/CardTodoDataSearch'
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'
import MessageTypography from '../components/MessageTypography'
import ErrorTypography from '../components/ErrorTypography'

import { apiSearch } from '../utils/todoApi'

const styles = theme => ({
  root: {
    padding: '20px',
  },
  title: {
    marginRight: '10px',
  },
  subtitle: {
  },
  form: {
    marginBottom: '15px',
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
  widthButton: {
    width: '100%',
    padding: '0',
  },
})

@withStyles(styles)
class PageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }
  static linkToDetail(id) {
    console.log(id)
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
      searchWord: '',
      todoLists: [],
      todoData: [],
      error: '',
    }
  }

  @autobind
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  @autobind
  async search() {
    try {
      const response = await apiSearch(this.state.searchWord)
      this.setState({
        todoLists: response.todolists,
        todoData: response.tododata,
      })
    } catch (error) {
      this.setState({
        error: error.message,
      })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <BaseLayout title="TODO" subtitle="検索" className={classes.root}>
        <div className={classes.root}>
          <Typography type="title" className={classes.flex}>
            検索
          </Typography>
          <form className={`${classes.flex} ${classes.form}`} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  name="searchWord"
                  label="検索テキストを入力してください"
                  fullWidth
                  className={classes.flex}
                  onChange={this.handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <Button raised color="primary" className={classes.widthButton} onClick={this.search}>
                  検索
                </Button>
              </Grid>
            </Grid>
          </form>

          <ErrorTypography errorMessage={this.state.error} />

          <MessageTypography message={(this.state.todoData.length > 0) ? `ToDoが${this.state.todoData.length}件見つかりました` : '対象のToDoは見つかりません'} />
          {this.state.todoData.map(data => (
            <CardTodoDataSearch key={data.id} data={data} linkToDetail={this.constructor.linkToDetail(data.todo_list_id)} />
          ))}

          <MessageTypography message={(this.state.todoLists.length > 0) ? `ToDoリストが${this.state.todoLists.length}件見つかりました` : '対象のToDoリストは見つかりません'} />
          {this.state.todoLists.map(data => (
            <CardTodoListSearch key={data.id} data={data} linkToDetail={this.constructor.linkToDetail(data.id)} />
          ))}

        </div>
      </BaseLayout>
    )
  }
}


export default mobxWithRoot(materialUiWithRoot(PageComponent))
