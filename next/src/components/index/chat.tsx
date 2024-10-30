import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import { useSettings } from "../../hooks/useSettings";
import { useAgentStore } from "../../stores";
import { useTaskStore } from "../../stores/taskStore";
import type { Message } from "../../types/message";
import AgentControls from "../console/AgentControls";
import { ChatMessage } from "../console/ChatMessage";
import ChatWindow from "../console/ChatWindow";
import { ChatWindowTitle } from "../console/ChatWindowTitle";
import Summarize from "../console/SummarizeButton";
import FadeIn from "../motions/FadeIn";
import TimeLine from "../../pages/timeLine";

type ChatProps = {
  messages: Message[];
  disableStartAgent: boolean;
  handlePlay: (name: string, goal: string) => void;
  nameInput: string;
  goalInput: string;
  setAgentRun: (newName: string, newGoal: string) => void;
  goals: { text: string; isEditing: boolean }[]; // 当前 goals 的值

};
const Chat = (props: ChatProps) => {
  const { goals, nameInput, goalInput } = props; // 解构 props

  
  const { settings } = useSettings();
  const { t } = useTranslation("indexPage");
  const [chatInput, setChatInput] = React.useState("");
  const agent = useAgentStore.use.agent();
  const agentLifecycle = useAgentStore.use.lifecycle();

  const tasks = useTaskStore.use.tasks();

  return (
    <>
      <div className="flex w-full flex-grow flex-col items-center overflow-hidden bg-[#f8f8f8] text-black p-2 rounded">

        <div className="mx-auto mx-8 my-2 w-full">
          <FadeIn
            initialX={-45}
            initialY={0}
            delay={0.1}
            className="border border-gray-300 bg-white p-4"  
          >
            <div className="flex flex-row gap-4">
              <h1 className="text-4xl font-bold text-slate-12">{nameInput}</h1>
            </div>
            <h2 className="text-xl font-light text-slate-12">
             {goalInput}
            </h2>

          </FadeIn>
        </div>

        <div className="flex w-full gap-6">
          <div className="w-1/4 p-4 pl-10 mt-4">
            <TimeLine goals={goals} />
          </div>
          <div className="w-3/4 border border-gray-300 bg-white p-4 rounded">
            <ChatWindow
              messages={props.messages}
              title={<ChatWindowTitle model={settings.customModelName} />}
              chatControls={
                agent
                  ? {
                    value: chatInput,
                    onChange: (value: string) => {
                      setChatInput(value);
                    },
                    handleChat: async () => {
                      const currentInput = chatInput;
                      setChatInput("");
                      await agent?.chat(currentInput);
                    },
                    loading: tasks.length === 0 || chatInput === "",
                  }
                  : undefined
              }
            >
              {props.messages.map((message, index) => (
                <FadeIn key={`${index}-${message.type}`}>
                  <ChatMessage message={message} />
                </FadeIn>
              ))}
              <Summarize />
            </ChatWindow>
          </div>
        </div>



      </div>
    </>
  );
};

export default Chat;
