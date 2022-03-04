// @ts-ignore
import styles from '../node_modules/bootstrap/dist/css/bootstrap.css';

import { default as React, FunctionComponent, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SwipeableViews from 'react-swipeable-views';

import { FactItem, FactList, Facts } from './components/facts';

type Questions = string[];

interface State {
  facts: Facts;
  questions: Questions;
}

enum Model {
  Fact = 'fact',
  Question = 'question',
}

enum Action {
  FactsChanged,
  QuestionsChanged,
}

interface ActionData {
  type: Action;
  facts?: Facts;
  questions?: Questions;
}

const initialState: State = {
  facts: ['test', 'test'],
  questions: [],
};

function reducer(state: State, action: ActionData): State {
  return initialState;
}


const PaizoProlog = () => {
  const [{ facts }, dispatch] = useReducer(reducer, initialState);

  return <SwipeableViews>
    <FactList
      facts={facts}
      onChange={(facts: Facts) => dispatch({ type: Action.FactsChanged, facts })}
    />
  </SwipeableViews>;
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<PaizoProlog />, document.querySelector('body'));
});
