import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: React.MouseEventHandler;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-primary text-white px-8 py-3 rounded-full text-md font-ptsans-bold"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
