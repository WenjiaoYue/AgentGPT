import axios from "axios";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import TimeIcon from "../../public/time.svg"; // Adjust the import path as necessary

type DetailProps = {
  nameInput: string;
  goalInput: string;
  goals: { text: string; isEditing: boolean }[];
};

const TimeLine = ({ nameInput, goalInput, goals }: DetailProps) => {
  const [t] = useTranslation("settings");

  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {goals.map((goal, index) => (
        <li key={index} className="mb-10 ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <TimeIcon width="24" height="24" className="text-gray-500" />

          </span>
          <h3 className="flex items-center mb-1 text-lg font-semibold dark:text-white">
            Goal {index + 1}
            {/* <span className="bg-blue-100 text-blue-800 text-sm font-medium ms-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
              Image
            </span> */}
          </h3>
          {/* <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            {goal.text}
          </time> */}
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 truncate">
            {goal.text}
          </p>
          {/* <a
            href="#"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >

            Download ZIP
          </a> */}
        </li>
      ))}
    </ol>
  );
};

export default TimeLine;
