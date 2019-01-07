import React from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Link, Redirect } from 'react-router-dom';
import { orderBy } from 'lodash';

import { loadQuestions, loadUsers, loadUser } from '../actions';

import QuestionCard from '../components/QuestionCard';

const tabDetail = [{
  key: 'unansweredQuestions',
  tab: 'Unanswered Questions',
}, {
  key: 'answeredQuestions',
  tab: 'Answered Questions',
}];

class Home extends React.Component {
  state = {
    key: 'unansweredQuestions',
    noTitleKey: 'app',
    tabList: tabDetail,
    users: {},
    contentList: {},
    isLoading: false,
    dataFiltering: false,
    questionSet: []
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  componentDidMount(){
    this.props.getQuestions();
    this.props.getUsers().then(response => {
      this.setState({
        users: response.users,
        isLoading: true
      });
    });
  }

  static getDerivedStateFromProps(props, state){
        let answeredQuestionsArr = [], unansweredQuestionsArr = []

         props.questions.forEach(ques => {
          if(state.isLoading && props.currentUser !== null){
            let userAnswers = state.users[props.currentUser].answers;
             if(userAnswers.hasOwnProperty(ques.id)){
                answeredQuestionsArr.push({
                   id: ques.id,
                   userName: state.users[ques.author].name,
                   question: ques.optionOne.text,
                   avatarURL: state.users[ques.author].avatarURL,
                   createdOn: new Date(ques.timestamp)
                 });
             } else {
               unansweredQuestionsArr.push({
                  id: ques.id,
                  userName: state.users[ques.author].name,
                  question: ques.optionOne.text,
                  avatarURL: state.users[ques.author].avatarURL,
                  createdOn: new Date(ques.timestamp)
                });
             }
          }else {
            return (<Redirect to="/login" />)
          }
        });
        state.contentList['unansweredQuestions'] = orderBy(unansweredQuestionsArr, ['createdOn'],['desc']);
        state.contentList['answeredQuestions'] = orderBy(answeredQuestionsArr, ['createdOn'],['desc']);
        if(state.contentList.answeredQuestionsArr !== [] && state.contentList.unansweredQuestions !== []){
          state.dataFiltering = true
        }
        return null;
  }

  render() {
    let { key, tabList, contentList, dataFiltering, isLoading } = this.state;
    let { currentUser } = this.props;
    return (
        <div>
          { isLoading && currentUser === null &&
            <Redirect to="/login" />
          }
         { currentUser !== null && isLoading &&
            <Card
            style={{ width: '70%', margin: 80 }}
            tabList={tabList}
            activeTabKey={key}
            onTabChange={(key) => { this.onTabChange(key, 'key'); }}>
            { dataFiltering && contentList[key].map(arr => (
                  <Link to={{ pathname: "/questions/" + arr.id}} key={arr.id}>
                     <QuestionCard
                        key={arr.id}
                        userName={arr.userName}
                        question={arr.question}
                        avatarURL={arr.avatarURL}/>
                   </Link>
                ))
            }
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
    getCurrentUser: () => dispatch(loadUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
