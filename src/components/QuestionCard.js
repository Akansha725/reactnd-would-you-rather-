import React from 'react';
import { Card, Button, Avatar } from 'antd';

export default class QuestionCard extends React.Component {

  render(){
    let { userName, question, avatarURL } = this.props
    return(
      <Card title= {`${userName} asks:`}
        headStyle={{backgroundColor: 'lightgray', flex: 1}}>
          <Card.Grid style={{boxShadow: 'none', width: '30%'}}>
            <Avatar size={100} src={avatarURL} />
          </Card.Grid>
          <Card.Grid style={{boxShadow: 'none', width: '70%'}}>
            <Card.Meta title="Would you rather " style={{paddingBottom: 10, fontSize: 20, fontWeight: 'bold'}}/>
            <Card.Meta title={question} style={{margin: 10}}/>
            <Button type="primary" ghost style={{width: '100%'}}>View Poll</Button>
          </Card.Grid>
      </Card>
    );
  }
}
