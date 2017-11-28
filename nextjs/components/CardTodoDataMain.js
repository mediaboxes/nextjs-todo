import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import moment from 'moment'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank'
import IconButton from 'material-ui/IconButton'
import CheckBox from 'material-ui-icons/CheckBox'
import Delete from 'material-ui-icons/Delete'
import deepOrange from 'material-ui/colors/deepOrange'
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
  completeAvatar: {
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  todoCard: {
    marginBottom: '15px',
  },
  todoCardMain: {
    display: 'flex',
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  cartHeader: {
    paddingBottom: '0px',
  },
})

@withStyles(styles)
export default class Component extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    changeCompleat: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
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
      classes, data, changeCompleat, deleteTodo,
    } = this.props
    return (
      <Card className={classes.todoCard} key={data.id}>
        <div className={classes.todoCardMain}>
          <CardHeader
            className={`${classes.flex} ${classes.cartHeader}`}
            avatar={
              <Avatar aria-label="Recipe" className={data.complete ? classes.completeAvatar : classes.avatar}>
                {data.complete ? <CheckBox /> : <CheckBoxOutlineBlank />}
              </Avatar>
          }
            title={data.text}
          />
          <CardActions disableActionSpacing>
            <div className={classes.flexGrow} />
            <Button raised={!data.complete} color="primary" onClick={changeCompleat}>{!data.complete ? '完了' : '未完了に戻す'}</Button>
          </CardActions>
        </div>
        <CardContent>
          <Typography component="p">
            {`期限 : ${moment(data.deadline_at).format('YYYY年MM月DD日')}`}<br />
            {`作成日 : ${moment(data.created_at).format('YYYY年MM月DD日')}`}
          </Typography>
        </CardContent>
        <CardActions disableActionSpacing>
          <div className={classes.flexGrow} />
          <IconButton aria-label="delete" onClick={this.handleRequestOpen}>
            <Delete />
          </IconButton>
        </CardActions>

        <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
          <DialogTitle>ToDoの削除確認</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {data.text} のToDoを削除します。この操作は戻すことが出来ません。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary"autoFocus>
              キャンセル
            </Button>
            <Button onClick={deleteTodo} raised color="accent" >
              削除
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    )
  }
}

