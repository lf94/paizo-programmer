import { default as React, CSSProperties, FC } from 'react';

interface Props {
  onClick: () => void;
  content: string;
  className: string;
}

const arrowStyleOuter: CSSProperties = {
    position: 'relative',
    bottom: 'calc(13mm / 2)',
};
const arrowStyleInner: CSSProperties = {
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
const arrowStyleContent: CSSProperties = {
  fontSize: '10mm',
  lineHeight: '10mm',
  paddingLeft: '0.2em',
};

export const Arrow: FC<Props> = ({ onClick, content, className }) =>
  <div onClick={(e) => { e.stopPropagation(); onClick(); }} style={arrowStyleOuter}>
    <div className={className} style={arrowStyleInner}>
         <span style={arrowStyleContent}>
           {content}
         </span>
    </div>
  </div>;

