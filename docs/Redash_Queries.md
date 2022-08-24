Query Name: Engagement
Select source_engagement_id from engagement where is_active = true

Query Name: Survey Completed
Comment: Used for the survey completed counter
Select * from user_response_detail
where engagement_id =  {{Engagement ID}}

Query Name: TypeRadioResponses
Comment: Used for the bar chart under what we heard
Select req.label, resp.value as request_label, resp.value as groupby, count(resp.value)
from response_type_radio resp left join request_type_radio req 
on resp.survey_id = req.survey_id 
and resp.request_key = req.key 
and resp.request_id = req.request_id 
where resp.is_active = true and req.is_active = true  
and resp.survey_id = (select id from survey where is_active = true and 
engagement_id = {{Engagement ID}})
group by req.label, resp.value

Query Name: TypeSelectboxResponses
Comment: Used for the pie chart under what we heard
Select req.label, resp.value as request_label, resp.value as groupby, count(resp.value)
from response_type_selectbox resp left join request_type_selectbox req 
on resp.survey_id = req.survey_id 
and resp.request_key = req.key 
and resp.request_id = req.request_id 
where resp.is_active = true and req.is_active = true  
and resp.survey_id = (select id from survey where is_active = true and 
engagement_id = {{Engagement ID}})
group by req.label, resp.value