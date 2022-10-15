import React from 'react';

interface ButtonProps {
  text: string;
  onClick: React.MouseEventHandler;
}

export const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-primary text-white px-8 py-3 rounded-full text-md font-bold absolute top-8 right-4"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
