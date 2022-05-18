import { setEngagements } from "./engagementSlice";
import http from "../components/common/http-common.ts";
import { Dispatch } from "redux";
import UserService from "./UserServices";

export const fetchAll = async (
  dispatch: Dispatch<any>
): Promise<Engagement[]> => {
  const responseData = await http.get<Engagement[]>("/engagement/", {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${UserService.getToken()}`,
    },
  });
  dispatch(setEngagements(responseData.data));
  return responseData.data;
};

export const postEngagement = async (data: any): Promise<any> => {
  const response = await http.post("/engagement/", data, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${UserService.getToken()}`,
    },
  });
  return response.data;
};
