// @ts-ignore
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import { default as React, FC, useCallback, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { DraggableLocation } from 'react-beautiful-dnd';
import { create as createTauSession } from 'tau-prolog';

import { factsAsText, factsAsBlocks } from './test-data';
import { FactItem, FactList, Facts } from './components/facts';
import { QuestionModal } from './components/question-modal';
import { AnswersModal } from './components/answers-modal';

enum Display {
  QuestionModal = 'question-modal',
  AnswersModal = 'answers-modal',
}

interface State {
  facts: Facts;
  question: string;
  answers: string[];
  display: Display;

  // TODO: Maybe get tau-prolog typed.
  tau: any;
}

enum Model {
  Fact = 'fact',
  Question = 'question',
}

enum Action {
  FactMove,
  FactChange,
  FactInsert,
  FactClear,
  FactsLoad,
  QuestionChange,
  DisplayAnswersModal,
  DisplayQuestionModal,
  AnswersMore,
  AnswerAdd,
  TauSessionUpdate,
}

interface ActionData {
  type: Action;
  source?: DraggableLocation;
  destination?: DraggableLocation;
  index?: number;
  text?: string;
  facts?: Facts;

  tau?: any;
  // Of type "Term"
  answer?: any;
}

const initialState: State = {
  facts: factsAsBlocks(factsAsText),
  question: '',
  answers: [],
  display: Display.QuestionModal,
  tau: undefined,
};

function move<A>(list: A[], source: number, destination?: number): A[] {
  let newList = [...list];
  const oldSource = newList[source];
  newList.splice(source, 1);

  // No destination means the source is just deleted and not inserted.
  if (destination !== undefined) {
    newList.splice(destination, 0, oldSource);
  }

  return newList;
}

function reducer(state: State, action: ActionData): State {
  switch (action.type) {
    case Action.FactMove: {
      const facts = move(state.facts, action.source!.index, action.destination?.index);
      return { ...state, facts };
    }
    case Action.FactInsert: {
      const facts = [...state.facts];
      facts.splice(action.index! + 1, 0, '');
      return { ...state, facts };
    }
    case Action.FactChange: {
      const facts = [...state.facts];
      facts[action.index!] = action.text!;
      return { ...state, facts };
    }
    case Action.FactClear: {
      const facts = [''];
      return { ...state, facts };
    }
    case Action.FactsLoad: {
      return { ...state, facts: action.facts! };
    }
    case Action.QuestionChange: {
      const question = action.text!;
      return { ...state, question };
    }
    case Action.DisplayAnswersModal: {
      return { ...state, display: Display.AnswersModal };
    }
    case Action.DisplayQuestionModal: {
      return { ...state, display: Display.QuestionModal, answers: [], tau: undefined };
    }
    case Action.TauSessionUpdate: {
      return { ...state, tau: action.tau };
    }
    case Action.AnswerAdd: {
      const answers = [...state.answers];
      // @ts-ignore
      const answer = Object.entries(action.answer.links).map(([k,v]) => `${k} = ${v.id}`).join('\n');
      answers.push(answer);
      return { ...state, answers };
    }
    default:
  }
  return initialState;
}

const StickyBottom: FC<{}> = (props) =>
  <div className='bg-white'
       style={{
         position: 'fixed',
         left: 0,
         bottom: 0,
         width: '100%',
         zIndex: 2}}>
    { props.children }
  </div>;

const PaizoProlog = () => {
  const [{
    facts,
    question,
    answers,
    display,
    tau,
  }, dispatch] = useReducer(reducer, initialState);

  const requestTauAnswer = useCallback(() => {
    tau.answer({
      success(answer) {
        dispatch({ type: Action.AnswerAdd, answer });
      }
    });
  }, [tau]);

  const saveFile = useCallback(async () => {
    const anchor = document.createElement('a');
    const message = facts.join('\n');
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const blob = new Blob([message], { type: 'text/plain' });
    anchor.download = hashHex + ".txt";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }, [facts]);
  
  const loadFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      // @ts-ignore
      var file = e.target.files[0];
      if (!file) { return; }
      var reader = new FileReader();
      reader.addEventListener("load", function() {
        const facts = factsAsBlocks(reader.result);
        dispatch({ type: Action.FactsLoad, facts });
      });
      reader.readAsText(file);
    };
    input.click();
  }, []);


  useEffect(() => {
    if (display == Display.AnswersModal) {
      const tau = createTauSession();
      tau.consult(facts.join('\n'), {
        success() {
          tau.query(question, {
            success() {
              dispatch({ type: Action.TauSessionUpdate, tau });
              tau.answer({
                success(answer) {
                  dispatch({ type: Action.AnswerAdd, answer });
                }
              });
            }
          });
        }
      });
    }
  }, [display]);

  return <div className='paizo-prolog'>
    <FactList
      facts={facts}
      onMove={(facts, source, destination) => dispatch({ type: Action.FactMove, facts, source, destination })}
      onInsert={(index) => dispatch({ type: Action.FactInsert, index })}
      onChange={(index, text) => dispatch({ type: Action.FactChange, index, text })}
    />
    <StickyBottom>
      { display == Display.QuestionModal && <QuestionModal
        text={question}
        onChange={(text) => dispatch({ type: Action.QuestionChange, text })}
        onExecute={() => dispatch({ type: Action.DisplayAnswersModal })}
        onSave={saveFile}
        onLoad={loadFile}
        onClear={() => dispatch({ type: Action.FactClear })}
      /> }
      { display == Display.AnswersModal && <AnswersModal
        answers={answers}
        onMore={requestTauAnswer}
        onStop={() => dispatch({ type: Action.DisplayQuestionModal })}
      /> }
    </StickyBottom>
  </div>;
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<PaizoProlog />, document.querySelector('body'));
});
