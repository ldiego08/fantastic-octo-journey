import { MouseEventHandler, PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-blue-500 text-white rounded-md pl-3 pr-3"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
