var parse = require('csv-parse')
var moment = require('moment');
var fs = require('fs');
var transform = require('stream-transform');

exports.handler = function(event, context, callback) {
	try {
		var date = moment(new Date()).format("MM-DD-YY");
		console.log("Date: " + date);

		console.log("States:");
		for(var i = 0; i < event.body.States.length; i++){
			console.log(event.body.States[i]);
		}

		// Call the callback with the return data
		callback(null, date);

	} catch (err) {
		console.log(err);
	}
	
}



var output = [];
var parser = parse({delimiter: ',', skip_empty_lines: true, columns: true}, function (err, data) {
	for (i in data) {
		var timezone = data[i]['timezone'];
		var dst = data[i]['dst'];
		var offset = +timezone + +dst;
		var state = data[i]['state'];
		if (state == 'PA') {
			var now = moment().utc().add(offset, 'hours').format('h:mm a');
			console.log(`time: ${now}\nstate: ${state}\noffset: ${offset}`);
			break;
		}
	}
})
var input = fs.createReadStream('zipcode.csv');
// var transformer = transform(function(record, callback){
//   setTimeout(function(){
//     callback(null, record.join(' ')+'\n');
//   }, 500);
// }, {parallel: 10});
input.pipe(parser);
//input.pipe(parser).pipe(transformer).pipe(process.stdout);