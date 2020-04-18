import React from 'react';
import Styles from './Button.module.scss';

export const Button: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = (props) => {
  const { children } = props;
  return (
    <button
      {...props}
      className={[props.className || '', Styles.button].join(' ')}>
      {children}
    </button>
  );
};
