import React from 'react';
import { connect } from 'react-redux';

import { Card, Select } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom'

import { saveUser, loadUsers } from '../actions/index';

class UserLogin extends React.Component {
  state = {
    users: {},
    currentUser: ''
  }

  componentDidMount() {
    this.props.getUsers().then(response => {
      this.setState({ users: response.users });
    });
  }

  handleChange = (user) => {
    this.props.setCurrentUser(user);
  }

  static getDerivedStateFromProps(props, state){
      if(props.location.state && props.location.state.referrer === "logout"){
         props.setCurrentUser(null);
      }
      return null;
  }

  render() {

    let { users } = this.state;
    let { state } = this.props.location;
    let { currentUser } = this.props;

    return (
      <Card
        style={{ width: '70%', margin: 80, textAlign: 'center' }}
        type="inner"
        title="Welcome to Would You Rather App!">
        <Card.Grid style={{width: '100%'}}>
            <Card.Meta style={{ textAlign: 'center', margin: 10}} title="Sign In" />
             <Link to={
                  state ? ((state.referrer === '/login' && currentUser !== null)? "/home": state.referrer)
                    : "/home"
                }>
                <Select
                    style={{ width: '100%', margin: 10}}
                    placeholder="Select a user"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                    { Object.keys(users).map( user => (
                       <Select.Option key={users[user].id} value={users[user].id}>{users[user].name}</Select.Option>
                     ))
                    }
                </Select>
            </Link>
        </Card.Grid>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: user => dispatch(saveUser(user)),
    getUsers: () => dispatch(loadUsers())
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserLogin)
