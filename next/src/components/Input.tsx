import clsx from "clsx";
import type { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from "react";

import Label from "./Label";
import type { toolTipProperties } from "../types";

type InputElement = HTMLInputElement | HTMLTextAreaElement;

interface InputProps {
  small?: boolean;
  left?: ReactNode;
  value: string | number | undefined;
  onChange: (e: ChangeEvent<InputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  subType?: string;
  attributes?: { [key: string]: string | number | string[] };
  toolTipProperties?: toolTipProperties;
  inputRef?: RefObject<InputElement>;
  onKeyDown?: (e: KeyboardEvent<InputElement>) => void;
  labelPosition?: 'top' | 'left'; // 新增labelPosition属性
  labelClassName?: string; // 新增可选的labelClassName属性
}

const Input = (props: InputProps) => {
  const isTypeTextArea = () => {
    return props.type === "textarea";
  };

  return (
    <div className={`flex ${props.labelPosition === 'left' ? 'flex-row' : 'flex-col'} w-full`}>
      {props.left && (
        <Label
          left={props.left}
          type={props.type}
          toolTipProperties={props.toolTipProperties}
          className={props.labelClassName}
        />
      )}
      {isTypeTextArea() ? (
        <textarea
          className={clsx(
            "delay-50 h-15 w-full resize-none rounded-xl border-2 border-slate-7 bg-slate-1 p-2 text-sm tracking-wider  outline-none transition-all selection:bg-sky-300  hover:border-sky-200 focus:border-sky-400 sm:h-20 md:text-lg",
            props.labelPosition === 'left' && "md:rounded-l-none",
            props.small && "text-sm sm:py-[0]"
          )}
          ref={props.inputRef as RefObject<HTMLTextAreaElement>}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          onKeyDown={props.onKeyDown}
          {...props.attributes}
        />
      ) : (
        <input
          className={clsx(
            "w-full rounded border border-gray-300 bg-slate-1 p-2 py-2 text-sm tracking-wider outline-none transition-all duration-200 selection:bg-sky-300 hover:border-sky-200 focus:border-sky-400 sm:py-3 md:text-lg",
            props.disabled && "cursor-not-allowed",
            props.labelPosition === "left" && "md:rounded-l-none rounded-xl border-2 border-slate-7 py-1",
            props.labelPosition === "top" && "rounded",
            props.small && "text-sm sm:py-[0]"
          )}
          value={props.value}
          onChange={props.onChange} // 添加这一行
          disabled={props.disabled}
          placeholder={props.placeholder}
          type={props.subType || "text"}
          ref={props.inputRef as RefObject<HTMLInputElement>}
          onKeyDown={props.onKeyDown}
          {...props.attributes}
        />

      )}
    </div>
  );
};

export default Input;
