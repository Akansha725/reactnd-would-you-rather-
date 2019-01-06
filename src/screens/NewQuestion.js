import React from 'react';
import { Card, Input, Divider, Button } from 'antd';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom'

import { loadUser, saveQuestion } from '../actions';

class NewQuestion extends React.Component {
  state = {
    optionA:'',
    optionB:''
  }

  componentDidMount(){
    this.props.getCurrentUser();
  }

  saveQuestion = () => {
    let { optionA, optionB } = this.state;
    let question = {}
    question['optionOneText'] = optionA;
    question['optionTwoText'] = optionB;
    question['author'] = this.props.currentUser;

    this.props.saveQuestions(question).then(response => {
        alert("Question Saved")
    });
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    let { optionA, optionB } = this.state;

    return (
      <Card
        style={{ width: '70%', margin: 80, textAlign: 'center'}}
        type="inner"
        title="Create New Question">
        <Card.Grid style={{width: '100%'}}>
            <Card.Meta title="Complete the question:" style={{margin: 10, padding: 0, textAlign: 'left' }}/>
            <Card.Meta title="Would you rather.."
                style={{
                    fontSize: 10,
                    margin: 10, padding: 0, textAlign: 'left'}}
             />
            <Input
              placeholder="Enter Option One Text Here"
              value={optionA}
              onChange={this.onChange}
              id="optionA"/>
            <Divider>Or</Divider>
            <Input
                placeholder="Enter Option Two Text Here"
                value={optionB}
                onChange={this.onChange}
                id="optionB" />
            <Link to="/home">
              <Button
                type="primary" ghost
                style={{margin: 15, width: '80%'}}
                onClick={this.saveQuestion}
                disabled={!(optionA !== '' && optionB !== '')}>Submit</Button>
            </Link>
        </Card.Grid>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => dispatch(loadUser()),
    saveQuestions: (question) => dispatch(saveQuestion(question))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(NewQuestion);
