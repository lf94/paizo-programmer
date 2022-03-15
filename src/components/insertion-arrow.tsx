import { default as React, CSSProperties, FC } from 'react';

interface Props {
  onClick: () => void;
}

const insertionArrowStyleOuter: CSSProperties = {
    position: 'relative',
    bottom: 'calc(13mm / 2)',
};
const insertionArrowStyleInner: CSSProperties = {
  borderBottomLeftRadius: '100%',
  borderTopLeftRadius: '100%',
  borderBottomRightRadius: '25%',
  borderTopRightRadius: '25%',
  width: '17mm',
  height: '13mm',
  position: 'absolute',
  right: '2mm',
  zIndex: 1,
};
const insertionArrowStylePlus: CSSProperties = {
  left: '7mm',
  bottom: '1.5mm',
  fontSize: '10mm',
  position: 'relative',
};

export const InsertionArrow: FC<Props> = ({ onClick }) =>
  <div onClick={(e) => { e.stopPropagation(); onClick(); }} style={insertionArrowStyleOuter}>
    <div className='border bg-white' style={insertionArrowStyleInner}>
         <span style={insertionArrowStylePlus}>
           +
         </span>
    </div>
  </div>;

