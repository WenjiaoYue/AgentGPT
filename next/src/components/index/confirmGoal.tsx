import React, { useEffect, useState, useRef } from "react";
import Input from "../Input";
import Button from "../Button";
import { FiEdit2 } from "react-icons/fi"; // 引入 edit 图标
import { AgentApi } from "../../services/agent/agent-api"; // 引入 AgentApi
import { log } from "console";


interface ConfirmProps {
  setNameInput: (value: string) => void; // 用于更新输入值的函数
  setGoalInput: (value: string) => void; // 用于更新输入值的函数
  handleNewAgent: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setGoals: (value: { text: string; isEditing: boolean }[]) => void; // 用于设置 goals 的函数
  goals: { text: string; isEditing: boolean }[]; // 当前 goals 的值
  nameInput: string;           // 当前输入值
  goalInput: string;           // 当前输入值

}

const ConfirmGoal = (props: ConfirmProps) => {
  const { setNameInput, setGoalInput, setGoals, goals, nameInput, goalInput, handleNewAgent } = props; // 解构 props
  const [goal, setGoal] = useState<string>(""); // 用于输入新的 goal

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previousGoalInput = useRef<string | null>(null); // 用于存储上一次的 goalInput


  useEffect(() => {
    if (goalInput === previousGoalInput.current) return; // 如果和上一次的 goalInput 相同，不执行
    previousGoalInput.current = goalInput; // 更新 previousGoalInput 为当前的 goalInput

    if (!goalInput) return; // 确保 goalInput 存在

    const agentApi = new AgentApi(goalInput); // 使用 goalInput 创建 AgentApi 实例

    const fetchInitialGoals = async () => {
      setLoading(true);
      setError("");

      try {
        const initialTasks = await agentApi.getInitialTasks();
        console.log('initialTasks', initialTasks);
        
        setGoals(initialTasks.map((task) => ({ text: task, isEditing: false }))); // 更新目标
        console.log('goals', goals);
        
      } catch (err) {
        console.error(err);
        setError("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialGoals(); // 在组件加载时调用
  }, [goalInput]); // 依赖于 goalInput，以便在其更改时重新获取目标

  const handleAddGoal = () => {
    if (goal.trim() !== "" && goals.length < 5) {
      setGoals([...goals, { text: goal, isEditing: false }]);
      setGoal("");
    }
  };

  const handleEditGoal = (index: number) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, isEditing: true } : goal
    );
    setGoals(updatedGoals);
  };

  const handleSaveGoal = (index: number, newText: string) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { text: newText, isEditing: false } : goal
    );
    setGoals(updatedGoals);
  };

  return (
    <>
      <div className="flex flex-col mt-4 bg-white p-4 w-full rounded-xl border border-gray-300 gap-4">
        <h2 className="text-3xl border-b-1 border-gray-300 font-bold">
          Create a new AI
        </h2>
        <div className="mb-4">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={"Name your AI"}
            small
            left="Enter AI Name"
          />
          <Input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder={"Describe your AI's role"}
            small
            left="Describe your AI's role"
          />
        </div>

        <div className="border border-gray-300 rounded p-4 gap-4">
          <h3 className="font-bold my-2">Enter up to 5 goals for your AI</h3>
          <div className="flex my-4">
            <input
              type="text"
              placeholder="Goal"
              className="border border-gray-300 p-2 flex-grow"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <Button
              className="bg-tremor-brand-intel text-white p-2 ml-2 px-10"
              onClick={handleAddGoal}
            >
              Add
            </Button>
          </div>

          <table className="border border-gray-300 w-full bg-white text-black gap-4">
            <thead>
              <tr className="bg-white text-black">
                <th className="border border-gray-300 p-2 py-4 text-center bg-white text-black ">
                  N*
                </th>
                <th className="border border-gray-300 p-2 py-4 text-center bg-white text-black ">
                  Goal
                </th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <tr key={index} className="bg-white text-black relative">
                  <td className="border border-gray-300 p-2 py-4 text-center bg-white text-black ">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 py-4 text-center bg-white text-black ">
                    {goal.isEditing ? (
                      <input
                        type="text"
                        className="border border-gray-300 p-1 w-full"
                        defaultValue={goal.text}
                        onBlur={(e) => handleSaveGoal(index, e.target.value)}
                      />
                    ) : (
                      <div className="relative flex items-center">
                        {goal.text}
                        <FiEdit2
                          className="absolute top-1 right-1 text-gray-500 cursor-pointer"
                          onClick={() => handleEditGoal(index)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <Button
              className="bg-tremor-brand-intel my-2"
              onClick={(e) => handleNewAgent(e)}
            >
              Start
            </Button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default ConfirmGoal;
