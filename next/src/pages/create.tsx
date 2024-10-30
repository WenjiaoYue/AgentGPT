import axios from "axios";
import clsx from "clsx";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import nextI18NextConfig from "../../next-i18next.config.js";
import FadeIn from "../components/motions/FadeIn";
import { useAuth } from "../hooks/useAuth";
import type { LLMModel } from "../hooks/useModels";
import { useModels } from "../hooks/useModels";
import { useSettings } from "../hooks/useSettings";
import DashboardLayout from "../layout/dashboard";
import type { GPTModelNames } from "../types";
import Button from "../ui/button";
import Input from "../ui/input";

const SettingsPage = () => {
  const [t] = useTranslation("settings");
  const { settings, updateSettings } = useSettings();
  const { getModel } = useModels();

  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | undefined>(undefined);

  const disableAdvancedSettings = true;
  const model = getModel(settings.customModelName) || {
    name: settings.customModelName,
    max_tokens: 2000,
    has_access: true,
  };

  const updateModel = (model: LLMModel) => {
    if (settings.maxTokens > model.max_tokens) {
      updateSettings("maxTokens", model.max_tokens);
    }

    updateSettings("customModelName", model.name as GPTModelNames);
  };

  const rows = [
    { number: 1, goal: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { number: 2, goal: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { number: 3, goal: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
    { number: 4, goal: 'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in.' },
    { number: 5, goal: 'Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen flex-grow">
        <div className="mx-auto w-4/5 gap-12"> 
          <FadeIn
            initialX={-45}
            initialY={0}
            delay={0.1}
            className="border-b border-slate-6 px-10 py-10"
          >
            <h1 className="text-4xl font-bold text-slate-14">Create a new AI</h1>
          </FadeIn>
          <FadeIn initialY={45} delay={0.1} className="mt-10 px-10">
            <Input
              label="Name your AI"
              name="AI-name"
              placeholder=""
              type="text"
              className="flex-grow-1 mr-2 my-2 py-2"
            />

            <Input
              label="Describe your AI's role"
              name="AI-role"
              placeholder=""
              type="text"
              value={settings.customApiKey}
              onChange={(e) => {
                setIsApiKeyValid(undefined);
                updateSettings("customApiKey", e.target.value);
              }}
              className="flex-grow-1 mr-2 my-2 py-2"
            />

            <div className="mt-4 flex flex-col mt-10">
              <h1 className="pb-4 text-base font-bold text-slate-14">Enter up to 5 goals for your AI</h1>

              <Input
                label="Goal"
                name="api-key"
                placeholder=""
                type="text"
                value={settings.customApiKey}
                onChange={(e) => {
                  setIsApiKeyValid(undefined);
                  updateSettings("customApiKey", e.target.value);
                }}
                className="flex-grow-1 mr-2"
                right={
                  <Button
                    className={clsx(
                      "transition-400 h-11 w-16 rounded text-sm text-white duration-200",
                      isApiKeyValid === undefined && "bg-tremor-brand-intel hover:bg-gray-700",
                      isApiKeyValid === true && "bg-tremor-brand-intel hover:bg-green-700",
                      isApiKeyValid === false && "bg-tremor-brand-intel hover:bg-red-700"
                    )}
                  >
                    {isApiKeyValid === undefined && "Add"}
                    {isApiKeyValid === true && <FaCheckCircle />}
                    {isApiKeyValid === false && <FaExclamationCircle />}
                  </Button>
                }
              />

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>N.º</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.number} style={{ height: '40px' }}> {/* 增加行高以增加间距 */}
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{row.number}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{row.goal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
