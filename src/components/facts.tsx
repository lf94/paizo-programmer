import { default as React, FC } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export type Fact = string;
export type Facts = Fact[];

interface FactProps {
  onChange: (fact: Fact) => void;
  fact: Fact;
}

interface FactsProps {
  onChange: (facts: Facts) => void;
  facts: Facts;
}

export const FactItem: FC<FactProps> = ({ onChange, fact }) => {
  return <div>tost</div>;
};

export const FactList: FC<FactsProps> = ({ onChange, facts }) =>
  <DragDropContext
    onDragEnd={(a) => {
      console.log(a);
      onChange(facts);
    }}>
    <Droppable droppableId='facts' type={'fact'} direction='vertical'>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
          {...provided.droppableProps}>
          { facts.map((f: Fact, index: number) =>
            <Draggable key={index} draggableId={'fact'+index} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}>
                    ok
                </div>
              )}
            </Draggable>
         )}
         {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>;
