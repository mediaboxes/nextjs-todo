import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank'
import CheckBox from 'material-ui-icons/CheckBox'

import 'isomorphic-fetch'

const styles = theme => ({
  flex: {
    flex: 1,
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
  widthButton: {
    width: '100%',
    padding: '0',
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
  }
  render() {
    const { classes, data, linkToDetail } = this.props
    return (
      <Card className={classes.todoCard} key={data.id}>
        <CardHeader
          className={classes.flex}
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {data.complete ? <CheckBox /> : <CheckBoxOutlineBlank />}
            </Avatar>
          }
          title={
            <Button color="primary" className={classes.widthButton} onClick={linkToDetail}>
              <span className={classes.textAlignLeft}>{data.text}</span>
            </Button>
            }
        />
        <CardContent>
          <Typography component="p">
            {`ToDoリスト名 : ${data.todo_list_title}`}<br />
            {`期限 : ${moment(data.deadline_at).format('YYYY年MM月DD日')}`}<br />
            {`作成日 : ${moment(data.created_at).format('YYYY年MM月DD日')}`}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}
