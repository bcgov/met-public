import { API_URL } from "../constants/constants";
import { setEngagements } from "./engagementSlice";
import http from "../components/common/http-common.ts";
import { Dispatch } from "redux";

const fetchAll = async (dispatch: Dispatch<any>): Promise<Engagement[]> => {
  const responseData = await http.get<Engagement[]>("/engagement/");
  dispatch(setEngagements(responseData.data));
  return responseData.data;
};

const EngagementService = {
  fetchAll,
};

export default EngagementService;
