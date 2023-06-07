```mermaid
erDiagram
    TENANT ||--o{ ENGAGEMENT : creates
    USER {
        id id
        string name
        string custNumber
        string kc_guid
        string is_active
    }
    TENANT_USER_MEMBERSHIP  |{--|{ USER : contains 
    TENANT_USER_MEMBERSHIP  |{--|{ TENANT : contains 
    TENANT_USER_MEMBERSHIP  {
        id id
        string user_id FK "users id"
        string tenant_id  FK "tenant id"
        string is_active
        string Role "role of the user in this tentant" 
    }

    ENGAGEMENT ||--|{ SURVEY : has
    ENGAGEMENT {
        id id
        string name
        string description
        dateFormat created_on
        dateFormat activeFrom
        dateFormat activeTo
        string tenant_id FK "Tenant Id"
        string is_active
    }
    SURVEY {
        id id
        string name
        string description
        string json "Stores the survey in json format"
        dateFormat created_on
        dateFormat activeFrom
        dateFormat activeTo
        string participant_id FK "Participannt Id"
        string tenant_id FK "Tenant Id; Not really needed here"
        string engagement_id  FK "Engagement Id"
        string is_active
    }

    SURVEY_SUBMISSIONS {
        id id
        string json "Stores the submissions in json format"
        string survey_id FK "Survey Id"
        string participant_id FK "Participant Id"
        string is_approved "default is always true"
    }
    SURVEY_COMMENTS {
        id id
        string comments "Could be JSON"
        string is_approved "To handle workflow"
        string survey_id FK "Survey Id"
        string participant_id FK "Participant Id"
    }
    USER  |{--|{ SURVEY_SUBMISSIONS : submits 
    USER  |{--|{ SURVEY_COMMENTS : submits 
    SURVEY  ||--|{ SURVEY_SUBMISSIONS : has 
    SURVEY  ||--|{ SURVEY_SUBMISSIONS : has 
    ```
