exports.generate = function(error,message,status,data)
{
var response = {
           error   : error,
           message : message,
           status  : status,
           data    : data
         }
     return response;
}
