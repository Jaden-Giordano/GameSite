"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./Objects');

var port = 27015;

var server = new Server(http, app, io, port);
