import clsx from "clsx";
import React from "react";

import Tooltip from "./Tooltip";
import type { toolTipProperties } from "../types";

interface LabelProps {
  left?: React.ReactNode;
  type?: string;
  toolTipProperties?: toolTipProperties;
  className?: string; 
}

const Label = ({ type, left, toolTipProperties, className }: LabelProps) => {
  const isTypeTextArea = () => {
    return type === "textarea";
  };

  return (
    <Tooltip
      child={
        <div
          className={clsx(
            "center flex min-w-[8em] items-center rounded-xl",
            "py-2 text-sm font-semibold tracking-wider text-slate-12 transition-all",
            isTypeTextArea() && "md:h-20",
            className 
          )}
        >
          {left}
        </div>
      }
      sideOffset={0}
      toolTipProperties={toolTipProperties}
    />
  );
};

export default Label;
