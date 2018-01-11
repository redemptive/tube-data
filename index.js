const request = require("request");
const http = require("http");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const fs = require("fs");
const port = 80;
let tubeData;
let dlrData;
let routes = [];

async function getAllData() {
	tubeData = await getData("https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true&app_id=deddaca2&app_key=43f241fe9e184b6aa7de7b615b28a6cb");
	tubeData = JSON.parse(tubeData);
	console.log("Got tube data");
	dlrData = await getData("https://api.tfl.gov.uk/Line/Mode/dlr/Status?detail=true&app_id=deddaca2&app_key=43f241fe9e184b6aa7de7b615b28a6cb");
	dlrData = JSON.parse(dlrData);
	console.log("Got DLR data");
	routes = [];
	for (var key in tubeData) {
		let data = await getData("https://api.tfl.gov.uk/Line/" + tubeData[key].id + "/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=true&app_key=43f241fe9e184b6aa7de7b615b28a6cb&app_id=deddaca2");
		data = JSON.parse(data);
		routes.push([]);
		for (var val in data.stopPointSequences[0].stopPoint) {
			routes[key].push(JSON.stringify(data.stopPointSequences[0].stopPoint[val].name));
		}
		console.log("Got " + tubeData[key].name + " line route");
	}
	buildHtml();
	startServer();
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

function writeToFile(data, fileName) {
	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, data, (err) => {
			if (err) {
				console.log(err);
				reject("Problem writing file");
			} else {
				resolve("Completed");
			}
		});
	});
}

function buildHtml() {
	return new Promise((resolve, reject) => {
		var $ = cheerio.load(fs.readFileSync("./index.html","utf-8"));
		for (var val in tubeData) {
			if (tubeData.hasOwnProperty(val)) {
				$("#tubeData" + val).empty();
				$("#tubeData" + val).append("<h2>" + tubeData[val].name + ": </h2>" + JSON.stringify(tubeData[val].lineStatuses[0].statusSeverityDescription));
				$("#tubeData" + val).append("<button class='routeToggler'>Show Route</button>");
				$("#tubeData" + val).append("<br><div class='routeDiv'>" + routes[val].toString().replace(/['"]+/g, '').replace(/[',]+/g, '<br>') + "</div>");
			}
		}
		$("#dlrData").empty();
		$("#dlrData").append("<h2>Dlr</h2>")
		$("#dlrData").append(JSON.stringify(dlrData[0].lineStatuses[0].statusSeverityDescription));
		writeToFile($.html(), "./index.html");
		console.log("HTML file updated")
	});
}

function startServer() {
	app.get("/", (req, res) => {
		console.log("Request recieved for " + req.url);
		res.write(fs.readFileSync("./index.html","utf-8"));
		res.end();
		console.log("Sent " + req.url);
	});
	app.get("/index.css", (req, res) => {
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(fs.readFileSync("./index.css","utf-8"));
		res.end();
	});
	app.get("/script.js", (req,res) => {
		res.writeHead(200, {'Content-Type': 'text/javascript'});
		res.write(fs.readFileSync("./script.js","utf-8"));
 		res.end();
	});
	app.listen(port, () => {
		console.log("Server started on port " + port); 
	});
}

getAllData();