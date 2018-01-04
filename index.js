const request = require("request");
const http = require("http");
const port = 80;
let tubeData;
let dlrData;
let victoriaData;
let routes = [];

async function getAllData() {
	tubeData = await getData("https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true&app_id=deddaca2&app_key=43f241fe9e184b6aa7de7b615b28a6cb");
	tubeData = JSON.parse(tubeData);
	console.log("Got tube data");
	dlrData = await getData("https://api.tfl.gov.uk/Line/Mode/dlr/Status?detail=true&app_id=deddaca2&app_key=43f241fe9e184b6aa7de7b615b28a6cb");
	dlrData = JSON.parse(dlrData);
	console.log("Got DLR data");
	victoriaData = await getData("https://api.tfl.gov.uk/Line/victoria/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=true&app_key=43f241fe9e184b6aa7de7b615b28a6cb&app_id=deddaca2");
	victoriaData = JSON.parse(victoriaData);
	routes = [];
	for (var key in tubeData) {
		let data = await getData("https://api.tfl.gov.uk/Line/" + tubeData[key].id + "/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=true&app_key=43f241fe9e184b6aa7de7b615b28a6cb&app_id=deddaca2");
		data = JSON.parse(data);
		routes.push([]);
		for (var val in data.stopPointSequences[0].stopPoint) {
			routes[key].push(JSON.stringify(data.stopPointSequences[0].stopPoint[val].name));
		}
	}
	console.log(routes);
}

function getData(site) {
	return new Promise((resolve, reject) => {
		request({
			uri: site,
		}, function(error, response, body) {
			data = body;
			resolve(data);
		});
	});
}


getAllData();
let timeout = setInterval(getAllData, 60000);

http.createServer(function (req, res) {
	console.log("Request recieved");
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("<h1>Tube Line Status</h1>")
	for (var key in tubeData) {
		if (tubeData.hasOwnProperty(key)) {
			res.write("<h2>" + tubeData[key].name + ": </h2>" + JSON.stringify(tubeData[key].lineStatuses[0].statusSeverityDescription));
			res.write("<br>" + routes[key].toString());
		}
	}
	res.write("<h1>DLR Line Status</h1>");
	res.write(JSON.stringify(dlrData[0].lineStatuses[0].statusSeverityDescription));
	res.end();
	console.log("Reply sent");
}).listen(port);

console.log("Listening on port: " + port);