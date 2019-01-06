import React from 'react';
import 'antd/dist/antd.css';
import { Card, Radio, Button, Avatar, Progress, Tag } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { loadQuestions, loadUsers, loadUser, saveAnswer } from '../actions';

class ShowPoll extends React.Component {
  state = {
    questions: [],
    users: {},
    isLoading: false,
    question: {},
    currentUser: '',
    option: 0,
    isUserSame: false,
    optionAPercent: 0,
    optionBPercent: 0,
    totalUsers: 0,
    votesForOptionA: 0,
    votesForOptionB: 0,
    showUserOptionA: false,
    showUserOptionB: false,
    savedResponse: {}
  }

  componentDidMount(){
    this.props.getCurrentUser();
    this.props.getQuestions();
    this.props.getUsers().then(response => {
      this.setState({
          users: response.users,
          isLoading: true,
          totalUsers: Object.keys(response.users).length
         });
    });
  }

  static getDerivedStateFromProps(props, state) {
    props.questions.forEach(ques => {
        if(ques.id === props.match.params.question_id ){
            state.question = ques;
            state.isUserSame = (ques.author === props.currentUser)
            let votesForOptionA = ques.optionOne.votes.length;
            let votesForOptionB = ques.optionTwo.votes.length;

            state.votesForOptionA = votesForOptionA;
            state.votesForOptionB = votesForOptionB;
            state.optionAPercent = (votesForOptionA/state.totalUsers)*100;
            state.optionBPercent = (votesForOptionB/state.totalUsers)*100;

            if((ques.optionOne.votes).includes(props.currentUser)){
                state.showUserOptionA = true
            }

            if((ques.optionTwo.votes).includes(props.currentUser)){
                state.showUserOptionB = true
            }
        }
    });

    return null;
  }

  onChange = (e) => {
    this.setState({
      option: e.target.value,
    });
  }

  saveAnswer = () => {
    let answers = {}
    answers['qid'] = this.props.match.params.question_id;
    answers['answer'] = this.state.option === 0 ? 'optionOne': 'optionTwo';
    answers['authedUser'] = this.props.currentUser;

    this.props.saveAnswers(answers).then(response => {
        alert("Response Saved")
    });
  }

  render() {
    let {
          users,
          question,
          isLoading,
          option,
          isUserSame,
          optionAPercent,
          optionBPercent,
          totalUsers,
          votesForOptionA,
          votesForOptionB,
          showUserOptionA,
          showUserOptionB } = this.state
    let  userDeatil = users[question.author]

    return (
      <div>
       { isLoading &&
             <Card style={{ width: '70%', margin: 80 }} title= {userDeatil ? `${userDeatil.name} asks`: ''}
               headStyle={{backgroundColor: 'lightgray', flex: 1}}>
                 <Card.Grid style={{boxShadow: 'none', width: '30%'}}>
                   <Avatar size={100} src={userDeatil.avatarURL} />
                 </Card.Grid>
                 <Card.Grid style={{boxShadow: 'none', width: '70%'}}>
                      { !showUserOptionA && !showUserOptionB &&
                        <div>
                            <Radio.Group onChange={this.onChange} value={option}  defaultValue={0}>
                              <Radio style={{margin:10}} value={0}>{question.optionOne.text}</Radio>
                              <Radio style={{margin:10}} value={1}>{question.optionTwo.text}</Radio>
                            </Radio.Group>
                            <Link to="/home">
                              <Button
                                 type="primary" ghost
                                 onClick={this.saveAnswer}
                                 style={{width: '100%', margin: 10}}>Submit</Button>
                           </Link>
                        </div>
                      }
                      { isUserSame && (showUserOptionA || showUserOptionB ) &&
                          <div>
                            {showUserOptionA && <Tag color="green">Your Vote</Tag>}
                            <Card title= {`Would you rather ${question.optionOne.text}`}
                              headStyle={{backgroundColor: 'white', flex: 1}}
                              style={{margin: 15}}>
                                <Progress style= {{margin: 10}}
                                  strokeLinecap="square"
                                  percent={Math.floor(optionAPercent)}
                                  strokeWidth ={25}/>
                              <Card.Meta style={{ textAlign: 'center', margin: 10}} title={`${votesForOptionA} out of ${totalUsers} votes`} />
                            </Card>
                            {showUserOptionB && <Tag color="green">Your Vote</Tag>}
                            <Card title= {`Would you rather ${question.optionTwo.text}`}
                              headStyle={{backgroundColor: 'white', flex: 1}}
                              style={{margin: 15}}>
                                  <Progress style= {{margin: 10}}
                                    strokeLinecap="square"
                                    percent={Math.floor(optionBPercent)}
                                    strokeWidth ={25}/>
                              <Card.Meta style={{ textAlign: 'center', margin: 10}} title={`${votesForOptionB} out of ${totalUsers} votes`} />
                            </Card>
                          </div>
                     }
                 </Card.Grid>
             </Card>
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
    saveAnswers: (ans) => dispatch(saveAnswer(ans)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowPoll);
