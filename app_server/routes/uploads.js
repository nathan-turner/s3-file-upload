/**********************************************************************
This defines the routes for the upload sections
***********************************************************************/
var file_uploads = require('../models/uploads');
var fun = require('../config/functions');
var message="";
var multer = require('multer');
var upload; //defined later


module.exports = function (app) {
	
//fileupload test page  
app.get('/fileupload',  
  function(req, res){
    res.render('file-upload', { user: req.user, valid: true, file_upload_name: 'file', prefix: 'profile', imagetype: 'image' });
});	

upload = multer({ dest: 'uploads/' }); //needed for S3 upload component

//file_upload_name: 'file', prefix: 'profile', imagetype: 'image'
app.post('/upload', upload.single('file'),
  function(req, res){	    
	var status, content;
	//function (req, res, resize, width, folder, type, cb) - signature
	file_uploads.upload(req, res, false, 300, null, 'img', function(err, file){
		if(err){
			console.log(Error(err));
			status=500;
			content = { error_code:1,err_desc:err,file:file};
		}
		else{
			status=200;
			content = { error_code:0,err_desc:null,file:file};			
		}		
		return fun.sendJSONresponse(res, status, content);		
	});	 
});



}