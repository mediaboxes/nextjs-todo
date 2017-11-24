import React from 'react'
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
      todoName: '',
      todoLimit: '2017-05-24',
    }
  }

  @autobind
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  @autobind
  addTodoList(event) {
    console.log(event)
  }

  render() {
    const { classes } = this.props
    return (
      <BaseLayout title="TODO" subtitle="検索" className={classes.root}>
        <div className={classes.root}>
          <Typography type="title" className={classes.flex}>
            検索
          </Typography>
          <form className={classes.flex} noValidate autoComplete="off" onSubmit={this.addTodoList} >
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
              </Grid>
              <Grid item xs={12} sm={2} className={classes.alignSelfBaseline}>
                <Button raised color="primary" className={classes.widthButton}>
                  検索テキスト
                </Button>
              </Grid>
            </Grid>
            <Typography type="caption" className={classes.flex}>
            エラーです
            </Typography>
          </form>

          <Card className={classes.todoCard}>
            <div className={classes.todoCardMain}>
              <CardHeader
                className={classes.flex}
                avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                り
                  </Avatar>
            }
                title={
                  <Button color="primary" className={classes.widthButton}>
                    <span className={classes.textAlignLeft}>タイトル</span>
                  </Button>
              }
                subheader="September 14, 2016"
              />
              <CardActions disableActionSpacing>
                <div className={classes.flexGrow} />
                <Button raised color="primary">完了</Button>
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
