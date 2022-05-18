import { default as React, FC, CSSProperties, useCallback, useState, useEffect, useRef } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableLocation,
} from 'react-beautiful-dnd';

import { Arrow } from './arrow';

export interface Fact {
  id: string;
  text: string;
}

export type Facts = Fact[];

interface FactProps {
  onChange: (text: string) => void;
  onInsert: () => void;
  fact: Fact;
}

interface FactsProps {
  onMove: (
    facts: Facts,
    source: DraggableLocation,
    destination?: DraggableLocation
  ) => void;
  onChange: (index: number, text: string) => void;
  onInsert: (index: number) => void;
  facts: Facts;
}

const factItemFontStyle: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '14px',

  // To prevent the scroll bars from blocking any text.
  paddingBottom: '1em',
};

export const FactItem: FC<FactProps> = ({ onChange, onInsert, fact }) => {
  const [isHidden, setHidden] = useState(true);
  let showPre = isHidden ? '' : 'd-none';
  let showTA = isHidden ? 'd-none' : '';
  const textArea = useRef(null);
  const pre = useRef(null);

  const onConfirmChange = useCallback(() => {
    if (textArea === null) { return; }
    // @ts-ignore
    textArea.current.blur();
  }, [textArea])

  useEffect(() => {
    // @ts-ignore
    textArea.current.focus();
  });

  const calculateHeight = useCallback(() =>
    fact.text.split('\n').length
  , [fact])

  return <div className='fact-item'>
    <div className='card'>
      <div className='card-body' onClick={() => setHidden(false)}>
        <pre style={factItemFontStyle} className={showPre} ref={pre}>
          { fact.text }
        </pre>
        <div className={showTA + ' mb-4'}>
          <textarea style={factItemFontStyle} className="form-control"
                    onChange={({ target: { value }}) => onChange(value)}
                    rows={calculateHeight()}
                    ref={textArea}
                    onBlur={() => setHidden(true)}
                    value={ fact.text }></textarea>
        </div>
      </div>
    </div>
    <Arrow
      className={isHidden ? 'btn btn-secondary' : 'btn btn-primary'}
      onClick={isHidden ? onInsert : onConfirmChange}
      content={isHidden ? '+' : '✓'}
    />
  </div>;
};

export const FactList: FC<FactsProps> = ({ onMove, onChange, onInsert, facts }) => {
  const onFactChange = useCallback((index: number) => (text: string) =>
    onChange(index, text), []);

  return <DragDropContext onDragEnd={({ source, destination }) => {
      onMove(facts, source, destination);
    }}>
    <Droppable droppableId='facts' type={'fact'} direction='vertical'>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}>
          { facts.map((f: Fact, index: number) =>
            <Draggable key={f.id} draggableId={f.id} index={index}>
              {(provided, snapshot) => (
                <div className='mt-2'
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}>
                    <FactItem onChange={onFactChange(index)} onInsert={() => onInsert(index)} fact={f}/>
                </div>
              )}
            </Draggable>
         )}
         {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>;
};
