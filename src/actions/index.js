import {
  _getQuestions,
  _getUsers,
  _getCurrentUser,
  _saveUser,
  _saveQuestion,
  _saveQuestionAnswer
} from '../utils/_DATA.js';

export const GET_USER = 'GET_USER';
export const GET_QUESTIONS = 'GET_QUESTIONS';
export const SAVE_QUESTIONS = 'SAVE_QUESTIONS';
export const SAVE_QUESTIONS_ANSWERS = 'SAVE_QUESTIONS_ANSWERS';
export const GET_USERS = 'GET_USERS';
export const SAVE_USER = 'SAVE_USER';

const getUser = currentUser => {
  return {
    type: GET_USER,
    currentUser
  };
};

export const loadUser = () => {
  return dispatch => {
    return _getCurrentUser().then(currentUser =>
      dispatch(getUser(currentUser))
    );
  };
};

const setCurrentUser = currentUser => {
  return {
    type: SAVE_USER,
    currentUser
  };
};

export const saveUser = user => {
  return dispatch => {
    return _saveUser(user).then(response => dispatch(setCurrentUser(response)));
  };
};

const getQuestions = questions => {
  return {
    type: GET_QUESTIONS,
    questions
  };
};

export const loadQuestions = () => {
  return dispatch => {
    return _getQuestions().then(response => {
      const questions = Object.keys(response).map(index => response[index]);
      dispatch(getQuestions(questions));
    });
  };
};

const getUsers = users => {
  return {
    type: GET_USERS,
    users
  };
};

export const loadUsers = () => {
  return dispatch => {
    return _getUsers().then(response => dispatch(getUsers(response)));
  };
};

const setQuestion = question => {
  return {
    type: SAVE_QUESTIONS,
    question
  };
};

export const saveQuestion = question => {
  return dispatch => {
    return _saveQuestion(question).then(response => dispatch(setQuestion(response)));
  };
};


const setAnswer = (answers) => {
  return {
    type: SAVE_QUESTIONS_ANSWERS,
    answers
  };
};

export const saveAnswer = answers => {
  return dispatch => {
    return _saveQuestionAnswer(answers).then(response => dispatch(setAnswer(response)));
  };
};
