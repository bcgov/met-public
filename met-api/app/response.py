import enum
import json


# Status Type
class StatusType(enum.Enum):
    success = "SUCCESS"
    fail = "FAIL"


# Token Type
class TokenType(enum.Enum):
    accessToken = "ACCESSTOKEN"
    refreshToken = "REFRESHTOKEN"


# Create response data
def ResponseModal(status, data, message):
    if data is None:
        data = ""
    else:
        data = json.loads(data)
    response = {
        "status": status,
        "data": data,
        "message": message
    }
    response = json.dumps(response)
    return response
