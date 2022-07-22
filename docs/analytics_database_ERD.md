```mermaid
erDiagram
    engagement {
        integer engagement_id PK
        string engagement_name
        timestamp start_date
        timestamp end_date
        string status_name
        timestamp created_date
        timestamp updated_date
        timestamp published_date
    }
    survey {
        integer survey_id PK
        string survey_name
        integer engagement_id FK "to engagement table"
        timestamp created_date
        timestamp updated_date
        string version "to maintain the version of a changed survey"
        string active_flag "soft delete a survey"
    }
    engagement ||--o{ survey : has
    user_response_details{
        id id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to engagement table"
        integer user_id FK "to user table"
        timestamp created_date
        timestamp updated_date
        string active_flag "soft delete a survey"
    } 
    survey ||--o{ user_response_details : has
    request_type_radio {
        string request_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        string request_key
        string request_type
        string request_label
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    survey ||--o{ request_type_radio : has 
    response_type_radio {
        integer response_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        integer user_id FK "to user table"
        string request_key FK "to request_type_radio table"
        string response_value
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    request_type_radio ||--o{ response_type_radio : has
    request_type_textfield {
        string request_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        string request_key
        string request_type
        string request_label
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    survey ||--o{ request_type_textfield : has 
    response_type_textfield {
        integer response_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        integer user_id FK "to user table"
        string request_key FK "to request_type_radio table"
        string response_value
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    request_type_textfield ||--o{ response_type_textfield : has
    request_type_textarea {
        string request_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        string request_key
        string request_type
        string request_label
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    survey ||--o{ request_type_textarea : has 
    response_type_textarea {
        integer response_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        integer user_id FK "to user table"
        string request_key FK "to request_type_radio table"
        string response_value
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    request_type_textarea ||--o{ response_type_textarea : has
    request_type_selectboxes {
        string request_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        string request_key
        string request_type
        string request_label
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    survey ||--o{ request_type_selectboxes : has 
    response_type_selectboxes {
        integer response_id PK
        integer survey_id FK "to survey table"
        integer engagement_id FK "to survey table"
        integer user_id FK "to user table"
        string request_key FK "to request_type_radio table"
        string request_label
        string request_value 
        string response_value
        timestamp created_date
        timestamp updated_date 
        string active_flag "soft delete a record"
    }
    request_type_selectboxes ||--o{ response_type_selectboxes : has 
    user_table {
        integer user_id PK
        string user_name
        timestamp created_date
        timestamp updated_date 
    }
    user_feedback {
        integer user_id PK
        integer survey_id FK "to survey table"
        string comments
        timestamp created_date
        timestamp updated_date 
        string sentiment_analysis
    }
