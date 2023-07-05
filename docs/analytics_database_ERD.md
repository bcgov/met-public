```mermaid
erDiagram
    engagement {
        integer id PK
		integer source_engagement_id
        string name
        timestamp start_date
        timestamp end_date
		timestamp published_date
        integer runcycle_id
        double latitude
        double longitude
        text geojson
        string marker_label
        timestamp created_date
        timestamp updated_date
        boolean is_active
    }
    survey {
        integer id PK
		integer source_survey_id
        string name
        integer engagement_id
        integer runcycle_id
        boolean generate_dashboard
        timestamp created_date
        timestamp updated_date
        boolean is_active
    }
    engagement ||--o{ survey : has
    user_response_details{
        id id PK
        integer survey_id FK "to survey table"
        integer engagement_id
        integer participant_id
        integer runcycle_id
        timestamp created_date
        timestamp updated_date
        boolean is_active
    } 
    survey ||--o{ user_response_details : has
    request_type_option {
        integer id PK
		string key
		string type
		string label
		string request_id
        integer survey_id FK "to survey table"
        string position
        integer runcycle_id
        boolean display
        timestamp created_date
        timestamp updated_date
        boolean is_active
    }
    survey ||--o{ request_type_option : has 
    response_type_option {
        integer id PK
		integer participant_id
		string request_key PK
		string value
		string request_id
        integer survey_id FK "to survey table"
        integer runcycle_id
        timestamp created_date
        timestamp updated_date
        boolean is_active
    }
    request_type_option ||--o{ response_type_option : has
    user_details {
        integer id PK
        string name
        integer runcycle_id
        timestamp created_date
        timestamp updated_date 
		boolean is_active
    }
    user_feedback {
        integer id PK
        integer survey_id FK "to survey table"
		integer participant_id
        string comments
		string sentiment_analysis
		string label
		integer source_comment_id
        integer runcycle_id
        timestamp created_date
        timestamp updated_date 
		boolean is_active
    }
    etl_runcycle {
        integer id PK
        string packagename
        timestamp startdatetime
        timestamp enddatetime
		string description
        boolean success
    }