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
})

@withStyles(styles)
export default class Component extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    changeCompleat: PropTypes.func.isRequired,
  }
  render() {
    const { classes, data, changeCompleat } = this.props
    return (
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
            <Button raised={!data.complete} color="primary" onClick={changeCompleat}>{!data.complete ? '完了' : '未完了に戻す'}</Button>
          </CardActions>
        </div>
        <CardContent>
          <Typography component="p">
            {`期限 : ${moment(data.deadline_at).format('YYYY年MM月DD日')}`}<br />
            {`作成日 : ${moment(data.created_at).format('YYYY年MM月DD日')}`}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

