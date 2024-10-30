import { type GetStaticProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useRef, useState } from "react";

import nextI18NextConfig from "../../next-i18next.config.js";
import HelpDialog from "../components/dialog/HelpDialog";
import { SignInDialog } from "../components/dialog/SignInDialog";
import Chat from "../components/index/chat";
import Landing from "../components/index/landing";
import ConfirmGoal from "../components/index/confirmGoal";

import { useAgent } from "../hooks/useAgent";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import DashboardLayout from "../layout/dashboard";
import { AgentApi } from "../services/agent/agent-api";
import { DefaultAgentRunModel } from "../services/agent/agent-run-model";
import AutonomousAgent from "../services/agent/autonomous-agent";
import { MessageService } from "../services/agent/message-service";
import {
  resetAllAgentSlices,
  resetAllMessageSlices,
  useAgentStore,
  useMessageStore,
} from "../stores";
import { useAgentInputStore } from "../stores/agentInputStore";
import { resetAllTaskSlices, useTaskStore } from "../stores/taskStore";
import { toApiModelSettings } from "../utils/interfaces";
import { languages } from "../utils/languages";
import { isEmptyOrBlank } from "../utils/whitespace";

const Home: NextPage = () => {
  const { t } = useTranslation("indexPage");
  const addMessage = useMessageStore.use.addMessage();
  const messages = useMessageStore.use.messages();
  const tasks = useTaskStore.use.tasks();

  const setAgent = useAgentStore.use.setAgent();
  const agentLifecycle = useAgentStore.use.lifecycle();

  const agent = useAgentStore.use.agent();

  const { session } = useAuth();
  const { settings } = useSettings();

  const nameInput = useAgentInputStore.use.nameInput();
  const setNameInput = useAgentInputStore.use.setNameInput();
  const goalInput = useAgentInputStore.use.goalInput();
  const setGoalInput = useAgentInputStore.use.setGoalInput();

  const [showSignInDialog, setShowSignInDialog] = React.useState(false);
  const [showConfirmGoal, setShowConfirmGoal] = React.useState(false);
  const [goals, setGoals] = useState<{ text: string; isEditing: boolean; }[]>([]);


  const agentUtils = useAgent();
  

  const goalInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    goalInputRef?.current?.focus();
  }, []);

  const setAgentRun = (newName: string, newGoal: string) => {
    setNameInput(newName);
    setGoalInput(newGoal);
    handlePlay(newGoal);
  };

  const disableStartAgent =
    (agent !== null && !["paused", "stopped"].includes(agentLifecycle)) ||
    isEmptyOrBlank(goalInput);

  const handlePlay = (goal: string) => {
    if (agentLifecycle === "stopped") handleRestart();
    // when showConfirmGoal is true, then trigger handleNewAgent
    else handelConfirmGoal(true);
    console.log('handlePlay', goal);

    // else handleNewAgent(goal.trim());
  };

  const handelConfirmGoal = (ConfirmGoal: boolean) => {
    console.log('confirm goal', ConfirmGoal);
    setShowConfirmGoal(ConfirmGoal);


  }


  const handleNewAgent = (goal: string) => {

    setShowConfirmGoal(false);

    if (agent && agentLifecycle == "paused") {
      agent?.run().catch(console.error);
      return;
    }

    const model = new DefaultAgentRunModel(goal.trim());
    const messageService = new MessageService(addMessage);
    // TODO .... Back_end
    const agentApi = new AgentApi({
      model_settings: toApiModelSettings(settings),
      goal: goal,
      agentUtils: agentUtils,
    });
    // use test
    const newAgent = new AutonomousAgent(
      model,
      messageService,
      settings,
      agentApi,
      session ?? undefined
    );
    setAgent(newAgent);
    newAgent?.run().then(console.log).catch(console.error);
  };

  const storeAgentDataInLocalStorage = (name: string, goal: string) => {
    const agentData = { name, goal };
    localStorage.setItem("agentData", JSON.stringify(agentData));
  };

  const getAgentDataFromLocalStorage = () => {
    const agentData = localStorage.getItem("agentData");
    return agentData ? (JSON.parse(agentData) as { name: string; goal: string }) : null;
  };

  useEffect(() => {
    if (session !== null) {
      const agentData = getAgentDataFromLocalStorage();

      if (agentData) {
        setNameInput(agentData.name);
        setGoalInput(agentData.goal);
        localStorage.removeItem("agentData");
      }
    }
  }, [session, setGoalInput, setNameInput]);

  const handleRestart = () => {
    resetAllMessageSlices();
    resetAllTaskSlices();
    resetAllAgentSlices();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Only Enter is pressed, execute the function
    if (e.key === "Enter" && !disableStartAgent && !e.shiftKey) {
      handlePlay(goalInput);
    }
  };

  return (
    <DashboardLayout
      onReload={() => {
        agent?.stopAgent();
        handleRestart();
      }}
    >

      <div id="content" className="flex min-h-screen w-full items-center justify-center">
        <div
          id="layout"
          className="relative flex h-screen w-full max-w-screen-xl flex-col items-center justify-center gap-5 overflow-hidden p-2 py-10 sm:gap-3 sm:p-4"
        >
          {showConfirmGoal ? (
            <ConfirmGoal
              setNameInput={setNameInput}
              setGoalInput={setGoalInput}
              nameInput={nameInput}
              goalInput={goalInput}
              goals={goals} // Pass the current goals value
              setGoals={setGoals} // 传递设置 goals 的函数
              handleNewAgent={() => handleNewAgent(goalInput)}
            />
          ) : agent !== null ? (
            <Chat
              messages={messages}
              disableStartAgent={disableStartAgent}
              handlePlay={handlePlay}
              nameInput={nameInput}
              goalInput={goalInput}
              setAgentRun={setAgentRun}
              goals={goals} 
            />
          ) : (
            <Landing
              messages={messages}
              disableStartAgent={disableStartAgent}
              handlePlay={() => handlePlay(goalInput)}
              handleKeyPress={handleKeyPress}
              goalInputRef={goalInputRef}
              goalInput={goalInput}
              setGoalInput={setGoalInput}
              setShowSignInDialog={setShowSignInDialog}
              setAgentRun={setAgentRun}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
