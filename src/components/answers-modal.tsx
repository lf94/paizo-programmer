import { default as React, FC, CSSProperties } from 'react';

type Answers = string[];

interface Props {
  answers: Answers;
  onMore: () => void;
  onStop: () => void;
}

const answersModalFontStyle: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '14px',
};

// Show one answer at a time
export const AnswersModal: FC<Props> = ({ onMore, onStop, answers }) => {
  console.log(answers);
  const latestAnswer = answers[answers.length - 1];
  return <div className="answers-modal">
    <div className='card'>
      <div className='card-body'>
        <pre style={answersModalFontStyle} className="border-bottom pb-4">
          { latestAnswer }
        </pre>
        <div className='row m-2'>
          <div className='col text-center'>
            <button className='btn btn-secondary w-100' onClick={onMore}>More</button>
          </div>
          <div className='col text-center'>
            <button className='btn btn-warning w-100' onClick={onStop}>Stop</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
