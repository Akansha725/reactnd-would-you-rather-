import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import rootReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import Header from './components/Header';
import Home from './screens/Home';
import NewQuestion from './screens/NewQuestion';
import Leaderboard from './screens/Leaderboard';
import UserLogin from './screens/UserLogin';
import ShowPoll from './screens/ShowPoll';

const store = createStore(rootReducer, applyMiddleware(logger, thunk))

export default function App() {
      return (
            <Provider store={store}>
                <Router>
                  <Switch>
                    <Header>
                      <Route exact path="/login" component={UserLogin}/>
                      <Route exact path="/home" component={Home}/>
                      <Route exact path="/new_question" component={NewQuestion}/>
                      <Route exact path="/leaderboard" component={Leaderboard}/>
                      <Route exact path="/questions/:question_id" component={ShowPoll}/>
                    </Header>
                  </Switch>
                </Router>
            </Provider>
      );
}
