import { setEngagements } from "./engagementSlice";
import http from "../components/common/http-common.ts";
import { Dispatch } from "redux";

export const fetchAll = async (
  dispatch: Dispatch<any>
): Promise<Engagement[]> => {
  const responseData = await http.get<Engagement[]>("/engagement/");
  dispatch(setEngagements(responseData.data));
  return responseData.data;
};

export const postEngagement = async (data: any): Promise<any> => {
  const response = await http.post("/engagement/", data);
  return response.data;
};
