import axios from "axios";
import { BASE_URL } from "./base";

export const runCodeAPI = async ({ language, code, input }) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/run`, {
      language,
      code,
      input,
    });

    return {
      success: true,
      output: res.data.output,
    };

  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Execution failed",
    };
  }
};