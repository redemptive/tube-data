const request = require("request");
let data;

async function programLoop() {
	await getData("https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true&app_id=deddaca2&app_key=43f241fe9e184b6aa7de7b615b28a6cb");
	data = JSON.parse(data);
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			console.log(data[key].name + " " + JSON.stringify(data[key].lineStatuses[0].statusSeverityDescription));
		}
	}
}

function getData(site) {
	return new Promise((resolve, reject) => {
		request({
			uri: site,
		}, function(error, response, body) {
			data = body;
			resolve("Success!");
		});
	});
}

programLoop();