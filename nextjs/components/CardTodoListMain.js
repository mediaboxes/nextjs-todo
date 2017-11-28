import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import moment from 'moment'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import ListIcon from 'material-ui-icons/List'
import Delete from 'material-ui-icons/Delete'
import IconButton from 'material-ui/IconButton'
import green from 'material-ui/colors/green'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  listAvatar: {
    color: '#fff',
    backgroundColor: green[300],
  },
  card: {
    marginBottom: '15px',
  },
  cartHeader: {
    paddingBottom: '0px',
  },
  widthButton: {
    width: '100%',
    padding: '0 15px',
    'text-transform': 'none',
  },
  textAlignLeft: {
    'text-align': 'left',
    width: '100%',
  },
})

@withStyles(styles)
export default class Component extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    linkToDetail: PropTypes.func.isRequired,
    deleteTodoList: PropTypes.func.isRequired,
  }
  constructor(props, context) {
    super(props, context)
    this.state = { open: false }
  }
  @autobind
  handleRequestOpen() {
    this.setState({ open: true })
  }
  @autobind
  handleRequestClose() {
    this.setState({ open: false })
  }
  @autobind
  handleRequestDelete() {
    this.handleRequestClose()
  }
  render() {
    const {
      classes, data, linkToDetail, deleteTodoList,
    } = this.props
    return (
      <Card className={classes.card} key={data.id}>
        <CardHeader
          className={`${classes.flex} ${classes.cartHeader}`}
          avatar={
            <Avatar aria-label="Recipe" className={classes.listAvatar}>
              <ListIcon />
            </Avatar>
                }
          title={
            <Button color="primary" className={classes.widthButton} onClick={linkToDetail}>
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
        <CardActions disableActionSpacing>
          <div className={classes.flexGrow} />
          <IconButton aria-label="delete" onClick={this.handleRequestOpen}>
            <Delete />
          </IconButton>
        </CardActions>

        <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
          <DialogTitle>ToDoリストの削除確認</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {data.text} のToDoリストを削除します。この操作は戻すことが出来ません。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary"autoFocus>
              キャンセル
            </Button>
            <Button onClick={deleteTodoList} raised color="accent" >
              削除
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    )
  }
}

