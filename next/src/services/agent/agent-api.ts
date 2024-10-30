import type { RequestBody } from "../../utils/interfaces";
import * as apiUtils from "../api-utils";

export class AgentApi {
  private goal: string; // 目标属性

  constructor(goal: string) {
    this.goal = goal;
  }

  async getInitialTasks(): Promise<string[]> {
    const response = await this.post<string[]>("/v1/agent/start", { query: this.goal });
    return response;
  }
  

  private async post<T>(url: string, data: Omit<RequestBody, "goal" | "model_settings">) {
    const requestBody: RequestBody = {
      query: this.goal,
      run_id: undefined,
      ...Object.fromEntries(Object.entries(data).filter(([key]) => key !== "query")),
    };

    try {
      const response = await apiUtils.post<T>(url, requestBody);
      return response;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
}
