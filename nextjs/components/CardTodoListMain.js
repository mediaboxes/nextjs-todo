import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import ListIcon from 'material-ui-icons/List'
import 'isomorphic-fetch'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  card: {
    marginBottom: '15px',
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
      <Card className={classes.card} key={data.id}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
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
      </Card>
    )
  }
}

