#!/usr/bin/node
const ipc = require('node-ipc').default
const fs = require("fs")

let stdinBuffer = fs.readFileSync(0)
let stdin = stdinBuffer.toString()

ipc.config.id = 'fuzzy-search-client';
ipc.config.retry = 1500;
ipc.config.silent = true

ipc.connectTo(
	'fuzzysearch',
	function () {
		ipc.of.fuzzysearch.on(
			'connect',
			function () {
				ipc.of.fuzzysearch.emit(
					'message',
					stdin.split('\n')
				)
			}
		);
		ipc.of.fuzzysearch.on(
			'message',
			function (data) {
				if (Object.values(data).length !== 0) {
					console.log(data)
				}
				process.exit()
			}
		);
	}
);