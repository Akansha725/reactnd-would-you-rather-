import React from 'react';
import { connect } from 'react-redux';
import { Menu, Layout, Avatar } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom'

import { loadUser, loadUsers } from '../actions';

class Header extends React.Component {
  state = {
    users: {},
    current: 'login'
  }

  componentDidMount(){
    this.props.getCurrentUser();
    this.props.getUsers().then(response => {
      this.setState({ users: response.users });
    });
  }

  handleClick = (e) => {
    this.setState({
      current: e.key
    });
  }

  render() {

    let { current, users } = this.state;
    const { currentUser, children } = this.props;

    return (
      <Layout style={{backgroundColor: 'white'}}>
        <Layout.Header style={{background: 'none'}}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[current]}
              mode="horizontal"
              style={{margin: 10, textAlign: 'center'}}>
                  <Menu.Item key="home">
                      Home
                       { (currentUser === null)? (
                           <Link to="/login"/>
                         ): (<Link to="/home"/>)
                       }
                  </Menu.Item>
                  <Menu.Item key="new_question">
                     New Question
                      { (currentUser === null)? (
                          <Link to="/login"/>
                        ): (<Link to="/new_question"/>)
                      }
                  </Menu.Item>
                  <Menu.Item key="leaderboard">
                    Leaderboard
                     { currentUser === null ? (
                         <Link to="/login"  key="from_leaderboard"/>
                       ): (<Link to="/leaderboard"/>)
                     }
                  </Menu.Item>

                  { currentUser &&
                      <Menu.Item key="userProfile">
                        {users &&
                            <div>
                                {`Hi, ${users[currentUser].name}`}
                                <Avatar style={{margin: 5}} src={users[currentUser].avatarURL}/>
                            </div>
                          }
                      </Menu.Item>
                  }
                  { currentUser &&
                      <Menu.Item key="logOut">
                        <Link to="/login">Logout</Link>
                      </Menu.Item>
                  }
                  { !currentUser &&
                    <Menu.Item key="login">
                      <Link to="/login">Login</Link>
                    </Menu.Item>
                  }
            </Menu>
        </Layout.Header>
           {children}
      </Layout>
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
    getCurrentUser: () => dispatch(loadUser()),
    getUsers: () => dispatch(loadUsers())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
