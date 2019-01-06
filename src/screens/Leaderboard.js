import React from 'react';
import 'antd/dist/antd.css';
import { Card, Avatar, Divider, Badge } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import { orderBy } from 'lodash';

import { loadQuestions, loadUsers, loadUser } from '../actions';

class Leaderboard extends React.Component {
  state = {
    users: [],
    isLoading: false,
  }

  componentDidMount() {
    this.props.getUsers().then(response => {
          let users = response.users, userArr = [];

          Object.keys(response.users).forEach(user => {
             let data={};
             data['name'] = users[user].name
             data['avatarURL'] = users[user].avatarURL
             data['answeredQuestions'] = (Object.keys(users[user].answers)).length
             data['questionsAsked'] = (users[user].questions).length
             data['totalScore'] = ((Object.keys(users[user].answers)).length + (users[user].questions).length)
             userArr.push(data)
           });

          this.setState({
              users: orderBy(userArr, ['totalScore'],['desc']),
              isLoading: true,
             });
    });
  }

  render() {

    let { users, isLoading } = this.state;
    let { currentUser } = this.props;

    return (
      <div>

      { isLoading && currentUser !== null && users.map( (user, index) => (
        <Card key={index}
          style={{ width: '80%', margin: 20, textAlign: 'left' }}
          headStyle={{backgroundColor: 'lightgray', flex: 1}}>
            <Card.Grid style={{boxShadow: 'none', width: '25%'}}>
              <Badge count={index+1}
                  style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}>
               <Avatar size={100} src={user.avatarURL} />
              </Badge>
            </Card.Grid>
            <Card.Grid style={{boxShadow: 'none', width: '50%'}}>
              <Card.Meta title={user.name}
                  style={{fontWeight: 'bold', textAlign: 'left'}}/>
              <Divider />
              <div>
                  <p>Answered Questions:  {user.answeredQuestions}</p>
              </div>
              <div>
                  <p>Questions Created: {user.questionsAsked}</p>
              </div>
            </Card.Grid>
            <Card.Grid style={{boxShadow: 'none', width: '25%'}}>
              <Card.Meta title="Score"
                  style={{fontWeight: 'bold', textAlign: 'left', margin:10}}/>
              <Avatar style={{ backgroundColor: "gold", verticalAlign: 'center' }} size="large">
                {user.totalScore}
              </Avatar>
            </Card.Grid>
        </Card>
       ))
      }
      { isLoading && currentUser === null &&
        <Redirect to="/login" />
      }
     </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
    questions: state.questions,
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQuestions: () => dispatch(loadQuestions()),
    getUsers: () => dispatch(loadUsers()),
    getCurrentUser: () => dispatch(loadUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
