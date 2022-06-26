export interface S3HeaderDetails {
    headers: {
        amzDate: string;
        authHeader: string;
    };
    filePath: string;
}

export interface S3FileDetails {
    ministrycode: string;
    requestnumber: string;
    filestatustransition: string;
    filename: string;
    s3sourceuri: string;
}
