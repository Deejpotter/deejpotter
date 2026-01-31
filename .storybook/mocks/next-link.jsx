import React from 'react';
export default function NextLink({children, href, ...rest}){
  return <a href={href || '#'} {...rest}>{children}</a>;
}
