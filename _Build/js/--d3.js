"use strict";

import * as Utility from "./libs/utility.js";

window.Utility = Utility;
window.d3 = require("d3");

import "./libs/set.js";
import "./libs/workout.js";
import "./libs/gym.js";

window.io = require("socket.io-client");
window.moment = require('moment');
window.$ = require('jquery-slim');

import "./libs/gym-live.js";

window.baseJS();