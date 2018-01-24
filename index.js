const request = require("request");
const http = require("http");
const express = require("express");
const app = express();
const fs = require("fs");
const ejs = require("ejs");
const port = 3000;
let interval;
let serverRunning = false;
let tubeData;
let dlrData;
let routes = [];

async function getAllData() {
	tubeData = await getData("https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true&app_id=deddaca2&app_key=43f241fe9e184b6aa7de7b615b28a6cb");
	tubeData = JSON.parse(tubeData);
	console.log("Got Tube data");
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
	if (!serverRunning) {
		app.set("view engine", "ejs");
		serverRunning = true;
		startServer();
	}
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

function startServer() {
	app.get("/", (req, res) => {
		console.log("Request recieved for " + req.url);
		res.render("index", {
			tubeData: tubeData,
			dlrData: dlrData,
			routes: routes
		});
		console.log("Sent " + req.url);
	});
	app.get("/index.css", (req, res) => {
		console.log("Request recieved for " + req.url);
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(fs.readFileSync("./index.css","utf-8"));
		res.end();
		console.log("Sent " + req.url);
	});
	app.get("/script.js", (req,res) => {
		console.log("Request recieved for " + req.url);
		res.writeHead(200, {'Content-Type': 'text/javascript'});
		res.write(fs.readFileSync("./script.js","utf-8"));
 		res.end();
 		console.log("Sent " + req.url);
	});
	app.listen(port, () => {
		console.log("Server started on port " + port); 
	});
}

getAllData();
interval = setInterval(getAllData, 60000);