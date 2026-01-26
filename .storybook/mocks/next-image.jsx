/* eslint-disable @next/next/no-img-element */
import React from 'react';
export default function NextImage(props){
  const { src, alt, width, height, className, style } = props;
  const s = typeof src === 'string' ? src : src?.src || '';
  return <img src={s} alt={alt} width={width} height={height} className={className} style={style} />;
}
