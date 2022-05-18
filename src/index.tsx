// Bootstrap 4 default styling
// import 'bootstrap/dist/css/bootstrap.css';

// Windows styling
// import 'bootstrap/dist/css/bootstrap.css';
// import 'winstrap/dist/css/winstrap.css';
// import 'winstrap/dist/css/winstrap-optional.css';

// Android styling
import '../node_modules/mdbootstrap/css/bootstrap.css';
import '../node_modules/mdbootstrap/css/mdb.lite.min.css';
import '../node_modules/mdbootstrap/css/style.css';

import { default as React, FC, useCallback, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { DraggableLocation } from 'react-beautiful-dnd';
import { create as createTauSession } from 'tau-prolog';
import {
  interpret as smlInterpreter,
  getFirstState as smlGetFirstState,
  State as smlState
} from '@sosml/interpreter';

import './style.css';

import { factsAsText, factsAsBlocks } from './test-data';
import { FactItem, FactList, Facts } from './components/facts';
import { QuestionModal } from './components/question-modal';
import { AnswersModal } from './components/answers-modal';

enum Display {
  QuestionModal = 'question-modal',
  AnswersModal = 'answers-modal',
}

enum Language {
  Prolog = 'Prolog',
  StandardML = 'Standard ML',
}

interface State {
  facts: Facts;
  question: string;
  answers: string[];
  display: Display;
  language: Language;

  // For now it's complex to type these.
  // In an ideal world the interpreters would be invoked externally.
  // But alas, we are coding for the web, using re-implementations.
  tau: any;
  sml: any;

  // Just a general list of lines for output
  outputs: string[];
  currentOutputIndex: number;
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
  OutputsAdd,
  AnswersMore,
  AnswerAdd,
  NextLanguage,
  TauSessionUpdate,
  SmlStateUpdate,
}

interface ActionData {
  type: Action;
  source?: DraggableLocation;
  destination?: DraggableLocation;
  index?: number;
  text?: string;
  facts?: Facts;
  outputs?: string[];

  tau?: any;
  sml?: any;
  // Of type "Term"
  answer?: any;
}

const initialState: State = {
  facts: factsAsBlocks(factsAsText),
  question: '',
  answers: [],
  display: Display.QuestionModal,
  language: Language.Prolog,
  tau: undefined,
  sml: undefined,
  outputs: [],
  currentOutputIndex: 0,
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

function nextElementInEnum<T extends object, U>(e: T, elem: U): U {
  const values = Object.values(e)
  let nextIndex = values.indexOf(elem) + 1;
  if (nextIndex >= values.length) {
    nextIndex = 0;
  }
  return values[nextIndex];
}

function reducer(state: State, action: ActionData): State {
  switch (action.type) {
    case Action.FactMove: {
      const facts = move(state.facts, action.source!.index, action.destination?.index);
      return { ...state, facts };
    }
    case Action.FactInsert: {
      const facts = [...state.facts];
      facts.splice(action.index! + 1, 0, { id: Math.random().toString(), text: '' });
      return { ...state, facts };
    }
    case Action.FactChange: {
      const facts = [...state.facts];
      facts[action.index!].text = action.text!;
      return { ...state, facts };
    }
    case Action.FactClear: {
      const facts = [{ id: Math.random().toString(), text: '' }];
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
      return { ...state, display: Display.QuestionModal, answers: [], tau: undefined, sml: undefined, outputs: [], currentOutputIndex: 0 };
    }
    case Action.OutputsAdd: {
      return { ...state, outputs: action.outputs || [] };
    }
    case Action.AnswerAdd: {
      const answers = [...state.answers];
      answers.push(action.answer);
      return { ...state, answers, currentOutputIndex: state.currentOutputIndex + 1 };
    }
    case Action.NextLanguage: {
      return { ...state, language: nextElementInEnum(Language, state.language) };
    }
    case Action.TauSessionUpdate: {
      return { ...state, tau: action.tau };
    }
    case Action.SmlStateUpdate: {
      return { ...state, sml: action.sml };
    }
    default:
  }
  return initialState;
}

const StickyBottom: FC<{}> = (props) =>
  <div className='bg-white'
       style={{
         width: '100%',
         zIndex: 2}}>
    { props.children }
  </div>;

const PaizoProgrammer = () => {
  const [{
    facts,
    question,
    answers,
    display,
    language,
    outputs,
    currentOutputIndex,
    tau,
    sml,
  }, dispatch] = useReducer(reducer, initialState);

  const requestAnswer = useCallback(() => {
    switch (language) {
      case Language.Prolog: {
        tau.answer({
          success(answerTau) {
            const answer = Object
              .entries(answerTau.links)
              // @ts-ignore
              .map(([k,v]) => `${k} = ${v.id}`)
              .join('\n');
            dispatch({ type: Action.AnswerAdd, answer });
          }
        });
        break;
      }
      case Language.StandardML: {
        const answer = outputs[Math.min(currentOutputIndex, outputs.length - 1)];
        dispatch({ type: Action.AnswerAdd, answer });
        break;
      }
      default:
        break;
    }
  }, [language, tau, sml]);

  const saveFile = useCallback(async () => {
    const anchor = document.createElement('a');
    const message = facts.map(s => s.text).join('\n');
    
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
    const sourceCode = facts.map(s => s.text).join('\n');

    if (display == Display.AnswersModal) {
      switch (language) {
        case Language.Prolog: {
          const tau = createTauSession();
          tau.consult(sourceCode, {
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
          break;
        }
        case Language.StandardML: {
          const sml = smlGetFirstState();
          const result = smlInterpreter(sourceCode + '\n' + question, sml);
          dispatch({ type: Action.SmlStateUpdate, sml: result });
          const outputs = result.warnings.map((e) => e.message);
          dispatch({ type: Action.OutputsAdd, outputs });
          const answer = outputs[0];
          dispatch({ type: Action.AnswerAdd, answer });
          break;
        }
        default:
          break;
      }
    }
  }, [display]);

  return <div className='paizo'>
    <div className='container'>
      <FactList
        facts={facts}
        onMove={(facts, source, destination) => dispatch({ type: Action.FactMove, facts, source, destination })}
        onInsert={(index) => dispatch({ type: Action.FactInsert, index })}
        onChange={(index, text) => dispatch({ type: Action.FactChange, index, text })}
      />
    </div>
    <StickyBottom>
      { display == Display.QuestionModal && <QuestionModal
        text={question}
        onChange={(text) => dispatch({ type: Action.QuestionChange, text })}
        onExecute={() => dispatch({ type: Action.DisplayAnswersModal })}
        onSave={saveFile}
        onLoad={loadFile}
        onClear={() => dispatch({ type: Action.FactClear })}
        onSwitchLanguage={() => dispatch({ type: Action.NextLanguage })}
        currentLanguage={language}
      /> }
      { display == Display.AnswersModal && <AnswersModal
        answers={answers}
        onMore={requestAnswer}
        onStop={() => dispatch({ type: Action.DisplayQuestionModal })}
      /> }
    </StickyBottom>
  </div>;
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<PaizoProgrammer />, document.querySelector('body'));
});
