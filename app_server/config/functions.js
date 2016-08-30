module.exports.sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.isEmptyField = function(field)
{	
	if(typeof(field)==='string')
		field = field.trim();
	if( typeof(field)===undefined || field=='' || field==null || field.length<=0 || !field )
		return true;
	else
		return false;
	
};

module.exports.arrayContains = function(arr, val) {
	if(arr.indexOf(val) !== -1)
		return true;
	else
		return false;
}