# s3-file-upload
Express Upload to S3 Using Angular
This uploader uses a combination of node/express and angular to upload files to S3.
The angular component is used as a <file-uploader></file-uploader> directive.
This makes use of the ng-file-upload npm module as well as multer, and sharp (for optional resizing).

Please make sure to set all of your AWS-related variables in your environment variables or this will not work.
You can use a .env file for your development environment.
