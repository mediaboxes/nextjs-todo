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
import { CircularProgress } from 'material-ui/Progress'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from 'material-ui-icons/Favorite'
import ListIcon from 'material-ui-icons/List'
import ShareIcon from 'material-ui-icons/Share'
import 'isomorphic-fetch'

import BaseLayout from '../components/BaseLayout'
import materialUiWithRoot from '../provider/materialUiWithRoot'
import mobxWithRoot from '../provider/mobxWithRoot'
import { apiTodolists, apiAddTodoList } from '../utils/todoApi'

import MessageTypography from '../components/MessageTypography'
import ErrorTypography from '../components/ErrorTypography'

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
      lists: props.initLists,
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


  render() {
    const { classes } = this.props
    return (
      <BaseLayout title="TODO" subtitle="TOP">
        <div className={classes.root}>
          <Typography type="title" className={classes.flex}>
            新しいToDoリストを作成する
          </Typography>
          <form className={`${classes.flex} ${classes.form}`} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }} >
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  label="新しいToDoリスト名を入力してください"
                  fullWidth
                  className={classes.flex}
                  onChange={this.handleChange('title')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <div className={classes.wrapper}>
                  <Button
                    raised
                    color="primary"
                    className={classes.widthButton}
                    disabled={this.state.addApiLoading}
                    onClick={this.addTodoList}
                  >
                    リストの作成
                  </Button>
                  {this.state.addApiLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </Grid>
            </Grid>
          </form>
          <MessageTypography message={this.state.message} />
          <ErrorTypography errorMessage={this.state.error} />

          {this.state.lists.map(data => (
            <Card className={classes.card} key={data.id}>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    <ListIcon />
                  </Avatar>
                }
                title={
                  <Button color="primary" className={classes.widthButton} onClick={this.constructor.linkToDetail(data.id)}>
                    <span className={classes.textAlignLeft}>{data.title}</span>
                  </Button>
                }
              />
              <CardContent>
                <Typography component="p">
                  {(data.all_count > 0) ? `${data.all_count}個中${data.complete_count}個がチェック済み` : 'ToDoがありません'}<br />
                  {(data.min_deadline) ? `~${moment(data.min_deadline).format('YYYY年MM月DD日')}` : null }
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
  form: {
    marginBottom: '15px',
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
