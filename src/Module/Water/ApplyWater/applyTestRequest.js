import axios from "axios";
import { WATER_API_ROUTES } from "../../../api/apiRoutes";
import { getToken } from "../../../utils/auth";

export const callTestRequest = async (payload) => {
  try {


  const token = await getToken(); 
//   console.log("Token:", token);

const response = await axios.post(
  WATER_API_ROUTES.TEST_REQUEST,
  payload,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
  }
);

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};
