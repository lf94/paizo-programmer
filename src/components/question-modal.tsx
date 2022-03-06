import { default as React, FC, CSSProperties } from 'react';

interface Props {
  onChange: (text: string) => void;
  onExecute: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  text: string;
}

const questionModalFontStyle: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '14px',
};

const buttonClasses = 'btn';
const buttonStyles = {
  width: 'calc(17mm * 3)',
  marginRight: '1em',
};

export const QuestionModal: FC<Props> = ({
  onChange,
  onExecute,
  onSave,
  onLoad,
  onClear,
  text
}) => {
  return <div className="question-modal">
    <div className='border'>
      <div className='overflow-scroll mt-3 mb-3 pb-4' style={ { whiteSpace: 'nowrap' } }>
        <button style={ {...buttonStyles, marginLeft: '1em' } }
                className={ buttonClasses + ' btn-primary' }
                onClick={onExecute}>
          Execute
        </button>
        <button style={ buttonStyles }
                className={ buttonClasses + ' btn-secondary' }
                onClick={onSave}>
          Save
        </button>
        <button style={ buttonStyles }
                className={ buttonClasses + ' btn-secondary' }
                onClick={onLoad}>
          Load
        </button>
        <button style={ buttonStyles }
                className={ buttonClasses + ' btn-warning' }
                onClick={onClear}>
          Clear
        </button>
      </div>
      <div className='m-3'>
        <textarea style={questionModalFontStyle} className="form-control"
                  onChange={({ target: { value }}) => onChange(value)}
                  value={ text }></textarea>
      </div>
    </div>
  </div>;
};
