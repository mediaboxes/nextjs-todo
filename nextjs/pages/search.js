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
  constructor(props, context) {
    super(props, context)
    this.state = {
      searchWord: '',
      todoLists: [],
      todoData: [],
    }
  }

  @autobind
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  @autobind
  async search(event) {
    const obj = { q: this.state.searchWord }
    const method = 'GET'
    const params = new URLSearchParams()
    Object.keys(obj).forEach((key) => {
      params.set(key, obj[key])
    })
    try {
      const response = await fetch(`http://localhost:3000/api/search?${params.toString()}`, { method })
      const json = await response.json()
      this.setState({
        todoLists: json.list,
        todoData: json.data,
      })
    } catch (error) {
      return []
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
          <form className={classes.flex} noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault() }}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={10} className={classes.alignSelfBaseline}>
                <TextField
                  name="searchWord"
                  label="検索名"
                  fullWidth
                  className={classes.flex}
                  onChange={this.handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <Button raised color="primary" className={classes.widthButton} onClick={this.search}>
                  検索テキスト
                </Button>
              </Grid>
            </Grid>
            <Typography type="caption" className={classes.flex}>
            エラーです
            </Typography>
          </form>

          {this.state.todoLists.map(data => (
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

          {this.state.todoData.map((data, index) => (
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
