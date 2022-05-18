import React, { createContext, useState } from "react";
import { postEngagement } from "../../services/EngagementService";
import { useNavigate } from "react-router-dom";

interface EngagementContext {
  rawEditorState: any;
  handleEditorStateChange: any;
  saveEngagement: any;
  saving: boolean;
}
export const ActionContext = createContext<EngagementContext>({
  rawEditorState: {},
  handleEditorStateChange: (newState: any) => {},
  saveEngagement: (engagement: any) => {},
  saving: false,
});

export const ActionProvider = ({ children }: { children: any }) => {
  const navigate = useNavigate();

  //should be saved in DB and given to Rich Text Editor for update engagement operation
  const [rawEditorState, setRawEditorState] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleEditorStateChange = (newState: any) => {
    setRawEditorState(newState);
  };

  const saveEngagements = async (engagement: any) => {
    setSaving(true);
    const response = await postEngagement({
      name: engagement.name,
      start_date: engagement.fromDate,
      end_date: engagement.toDate,
      description: engagement.description,
    });
    setSaving(false);
    if (response.status) {
      navigate("/");
    }
  };

  return (
    <ActionContext.Provider
      value={{
        rawEditorState,
        handleEditorStateChange,
        saveEngagement: saveEngagements,
        saving,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
