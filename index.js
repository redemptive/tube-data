// Imports
const request = require("request");
const http = require("http");
const express = require("express");
const app = express();
const fs = require("fs");
const ejs = require("ejs");
const port = 3000;

// Variables
const tflApiRoot = "https://api.tfl.gov.uk"
const tflKey = "43f241fe9e184b6aa7de7b615b28a6cb"
let refreshInterval = 120000; // Milliseconds
let serverRunning = false;
let tubeData;
let dlrData;
let routes = [];

// App configuration
app.use(express.static("static"));
app.set("view engine", "ejs");

async function getAllData() {
	if (!serverRunning) {
		console.log("*** Getting data from tube API ***");
	} else {
		console.log("*** Refreshing data from tube API ***");
	}
	await getData(`${tflApiRoot}/Line/Mode/tube/Status?detail=true&app_id=deddaca2&app_key=${tflKey}}`).then((response) => {
		tubeData = JSON.parse(response);
		console.log("Got Tube data");
	}, (error) => {
		if (!tubeData) {
			throw `Could not get tube data: ${error}`
		} else {
			console.log(`Could not get tube data, will keep using the last one: ${error}`);
		}
	});
	await getData(`${tflApiRoot}/Line/Mode/dlr/Status?detail=true&app_id=deddaca2&app_key=${tflKey}`).then((response) => {
		dlrData = JSON.parse(response);
		console.log("Got DLR data");
	}, (error) => {
		if (!dlrData) {
			throw `Could not get tube data: ${error}`
		} else {
			console.log(`Could not get dlr data, will keep using the last one: ${error}`);
		}
	});
	routes = [];
	for (let key in tubeData) {
		let data = await getData(`${tflApiRoot}/Line/${tubeData[key].id}/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=true&app_key=${tflKey}&app_id=deddaca2`);
		data = JSON.parse(data);
		routes.push([]);
		for (var val in data.stopPointSequences[0].stopPoint) {
			routes[key].push(JSON.stringify(data.stopPointSequences[0].stopPoint[val].name));
		}
		console.log(`Got ${tubeData[key].name} line route`);
	}
	if (!serverRunning) {
		console.log("*** Starting server ***");
		serverRunning = true;
		startServer();
	}
}

function getData(site) {
	return new Promise((resolve, reject) => {
		request({
			uri: site,
		}, function(error, response, body) {
			if (error) {
				reject(error);
			}
			resolve(body);
		});
	});
}

function startServer() {
	app.get("/", (req, res) => {
		console.log(`Request recieved for ${req.url}`);
		res.render("index", {
			tubeData: tubeData,
			dlrData: dlrData,
			routes: routes
		});
		console.log("Sent " + req.url);
	});
	app.get("/routes", (req, res) => {
		console.log(`Request recieved for ${req.url} from ${req.connection.remoteAddress}`);
		res.render("routes", {
			tubeData: tubeData,
			dlrData: dlrData,
			routes: routes
		});
		console.log(`Sent ${req.url}`);
	});
	app.listen(port, () => {
		console.log(`Server started on port ${port}`); 
	});
}

getAllData();
interval = setInterval(getAllData, refreshInterval);