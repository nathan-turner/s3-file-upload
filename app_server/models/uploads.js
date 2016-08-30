//handles file uploads
var fun = require('../config/functions');
var assert = require('assert');
var AWS = require('aws-sdk');
var fs = require('fs');
var sharp = require('sharp');
const img_width = 300; //can change
const max_img_width = 1200;
const S3_BUCKET = process.env.S3_BUCKET;
const max_file_size = 15000000;
const valid_types = ['image/jpg','image/jpeg','image/bmp','image/gif','image/png','image/svg','image/svg+xml','application/pdf','application/vnd.ms-excel','application/pdf','application/octet-stream','application/msword','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const resize_valid_types = ['image/jpg','image/jpeg','image/bmp','image/png'];

AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
AWS.config.update({region: 'us-east-1', limits: {fileSize: max_file_size, files: 2}}); //with 15mb limit

//options to make thumbnail, folder, and type
module.exports.upload = function (req, res, resize, width, folder, type, cb) {
	var file, pid, fieldname, filetype, size, extension, message, valid=true;
	
	if(resize && parseInt(width)<=0)
		width = img_width;
	if(!fun.isEmptyField(req.files)) //not empty so use array
		file = req.files.file;
	else
		file = req.file;
	
	if(!fun.isEmptyField(folder))
		folder = folder+'/';
	pid = folder + parseInt(Math.random() * 10000000);
	
	filetype = file.mimetype;
	size = file.size;
	console.log(filetype);
	
	if(!fun.isEmptyField(file.originalname))
		extension = file.originalname.split('.').pop();
	else
		valid=false, message='There was a problem with the file extension';

	if(size > max_file_size)
		valid=false, message='The file exceeds the max file size'; 
	if(!fun.arrayContains(valid_types, filetype))
		valid=false, message='The file type used is not allowed'; 
	if(!fun.arrayContains(resize_valid_types, filetype) && resize)
		valid=false, message='The image type used is not allowed to be resized'; 
	
	
	if(valid)
	{
    fs.readFile(file.path, function (err, data) {
        if (err) throw err; // Something went wrong!		
		var handleUpload = function(err,data){			
			console.log('image resized');
			exports.s3Upload(file, data, pid.toString(), function(err, file){					           
				return cb(err, file); 
			});
		}
		if(resize)
			exports.resize(data, img_width, file.name, handleUpload);
		else 
			handleUpload(err,data);
	});	   
	}
	else { 
		fs.unlink(file.path, function (err) {
            if (err) {
				console.error(err);
            }        
        }); 
		return cb(message, file);
	}    
    
};

module.exports.s3Upload = function(file, data, pid, cb)
{
	var s3bucket = new AWS.S3({params: {Bucket: S3_BUCKET}});
        s3bucket.createBucket(function () { 
            var params = {
				ACL: 'public-read', 
                Key: pid, //'profile/'+pid, //file.name doesn't exist as a property
                Body: data,
				ContentType: file.mimetype
            };
            s3bucket.upload(params, function (err, data) {
                // Whether there is an error or not, delete the temp file
                fs.unlink(file.path, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    //console.log('Temp File Delete');
                });               
				cb(err, file);
            });
        });
}

//use sharp to resize
module.exports.resize = function(imageData, width, fileName, cb){
    sharp(imageData).resize(parseInt(width), null).toBuffer(function (err, data) {
    //if (err) throw err;
	console.log('resize');
	return cb(err,data);       
    });
};

