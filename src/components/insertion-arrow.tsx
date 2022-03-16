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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  minWidth: '17mm',
};
const insertionArrowStylePlus: CSSProperties = {
  fontSize: '10mm',
  lineHeight: '10mm',
  paddingLeft: '0.2em',
};

export const InsertionArrow: FC<Props> = ({ onClick }) =>
  <div onClick={(e) => { e.stopPropagation(); onClick(); }} style={insertionArrowStyleOuter}>
    <div className='btn btn-primary' style={insertionArrowStyleInner}>
         <span style={insertionArrowStylePlus}>
           +
         </span>
    </div>
  </div>;

