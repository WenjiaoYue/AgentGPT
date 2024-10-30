import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import type { KeyboardEvent, RefObject } from "react";
import { useState } from "react";
import { FaCog, FaPlay, FaStar } from "react-icons/fa";

import { useAgentStore } from "../../stores";
import type { Message } from "../../types/message";
import AppTitle from "../AppTitle";
import Button from "../Button";
import ExampleAgents from "../console/ExampleAgents";
import Globe from "../Globe";
import Input from "../Input";

type LandingProps = {
  messages: Message[];
  disableStartAgent: boolean;
  handlePlay: () => void;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  goalInputRef: RefObject<HTMLInputElement>;
  goalInput: string;
  setGoalInput: (string) => void;
  setShowSignInDialog: (boolean) => void;
  setAgentRun: (newName: string, newGoal: string) => void;
};
const Landing = (props: LandingProps) => {
  const { t } = useTranslation("indexPage");
  const agent = useAgentStore.use.agent();

  return (
    <>
    <div className="max-w-screen-md">
  
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.75, type: "easeInOut" }}
    className="z-10"
  >
    <AppTitle />
  </motion.div>
  
  <div className="absolute left-0 right-0 m-auto grid place-items-center overflow-hidden opacity-40 z-0" style={{ pointerEvents: 'none' }}>
    <Globe />
  </div>
  
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.75, delay: 1, type: "easeInOut" }}
    className="z-10"
  >
    <ExampleAgents setAgentRun={props.setAgentRun} setShowSignIn={props.setShowSignInDialog} />
  </motion.div>
  
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.75, delay: 0.5, type: "easeInOut" }}
    className="z-10 flex w-full flex-col gap-6"
  >
    <Input
      inputRef={props.goalInputRef}
      left={
        <>
          <FaStar />
          <span className="ml-2">{`${t("LABEL_AGENT_GOAL")}`}</span>
        </>
      }
      value={props.goalInput}
      onChange={(e) => props.setGoalInput(e.target.value)}
      onKeyDown={props.handleKeyPress}
      placeholder={`${t("PLACEHOLDER_AGENT_GOAL")}`}
      type="textarea"
      labelPosition="left" 
      labelClassName="md:border-2 md:border-slate-7 md:bg-slate-4 text-sm md:rounded-r-none md:border-r-0 md:border-slate-7 text-sm font-semibold tracking-wider text-slate-12 transition-all md:bg-slate-4 md:py-3 md:pl-3 md:text-lg" 
    />

    <div className="flex w-full flex-row items-center justify-center gap-3">
      <Button
        onClick={props.handlePlay}
        className="border-0 bg-tremor-brand-intel subpixel-antialiased saturate-[75%] hover:saturate-100"
      >
        <FaPlay />
      </Button>
    </div>
  </motion.div>
</div>

  
    </>
  );
};

export default Landing;
