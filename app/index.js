import document from "document";
import * as messaging from "messaging";

let document = require("document");

let screen1 = document.getElementById("screen1");
let screen2 = document.getElementById("screen2");

let button1 = document.getElementById("button1");
let button2 = document.getElementById("button2");

let background1 = document.getElementById("background1");
let background2 = document.getElementById("background2");

let heart = document.getElementById("heart");

let chargebatt = document.getElementById("chargebatt");
let lowbatt = document.getElementById("lowbatt");
let halfbatt = document.getElementById("halfbatt");
let fullbatt = document.getElementById("fullbatt");

import { HeartRateSensor } from "heart-rate";   //heart rate in beats per min

import { display } from "display";
display.autoOff = false;
display.on = true;

import { vibration } from "haptics";

import { battery } from "power";


import { charger } from "power";
console.log("The charger " + (charger.connected ? "is" : "is not") + " connected");

import { today } from "user-activity";
console.log((today.local.steps || 0) + " steps");

import clock from "clock";

import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");

let chargepctLabel = document.getElementById("chargepct");

// Fetch UI elements we will need to change
let hrLabel = document.getElementById("hrm");
let stepsLabel = document.getElementById("steps");

let stressMsg = document.getElementById("stressMsg");
//let updatedLabel = document.getElementById("updated");
let meanHRLabel = document.getElementById("meanHR");
let stressLabel = document.getElementById("stress");
let timeLabel = document.getElementById("time");

let dateText1 = document.getElementById("date1");
let dateText2 = document.getElementById("date2");

// Keep a timestamp of the last reading received. Start when the app is started.
//let lastValueTimestamp = Date.now();

// Initialize the UI with some values
hrLabel.text = "--";
//updatedLabel.text = "...";
meanHRLabel.text= "...";
stressLabel.text = "Initializing";
stressMsg.text = "";

var meanHR = 0;
var array_HR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var index_HR = 0;
var totalHR = 0;

var lastStepCount = 0;
var currentStepCount = 0;

var stressState = "RELAXED";

let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Create a new instance of the HeartRateSensor object
var hrm = new HeartRateSensor();

function showScreen1() {
  console.log("Show screen 1");
  screen1.style.display = "inline";
  screen2.style.display = "none";
}

function showScreen2() {
  console.log("Show screen 2");
  screen1.style.display = "none";
  screen2.style.display = "inline"; 
}


button1.onclick = function() {
  showScreen2();
}

button2.onclick = function () {
  showScreen1();
}


document.onkeypress = function(evt) {
  if (evt.key === "back") {
    if (screen2.style.display === "inline") {
      // Go to screen 1
      showScreen1();
      evt.preventDefault();
    } 
    else if (screen1.style.display === "inline") {
      // Default behaviour to exit the app
    }
  }
}

if (charger.connected==true){
  chargebatt.style.display = "inline";
  lowbatt.style.display = "none";
  halfbatt.style.display = "none";
  fullbatt.style.display = "none";
}
else{
  chargepctLabel.text=Math.floor(battery.chargeLevel)+"%";
  
  if (Math.floor(battery.chargeLevel)<20){
    chargebatt.style.display = "none";
    lowbatt.style.display = "inline";
    halfbatt.style.display = "none";
    fullbatt.style.display = "none";
  }
  else if (Math.floor(battery.chargeLevel)<80){
    chargebatt.style.display = "none";
    lowbatt.style.display = "none";
    halfbatt.style.display = "inline";
    fullbatt.style.display = "none";
  }
  else{
    chargebatt.style.display = "none";
    lowbatt.style.display = "none";
    halfbatt.style.display = "none";
    fullbatt.style.display = "inline";
  }
}

// Declare an event handler that will be called every time a new HR value is received.
hrm.onreading = function() {
  // Peek the current sensor values
  console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = hrm.heartRate;
  stepsLabel.text = (today.local.steps||0);
  ///*
  
  if (index_HR < array_HR.length){
    array_HR[index_HR] = hrm.heartRate;
    index_HR++;
  }
  else{
    currentStepCount = today.local.steps;
    console.log("CurrentStep= "+ (today.local.steps || 0));
    meanHR = 0;
    totalHR = 0;
    var i;
    for (i = 0; i < array_HR.length; i++) {
      totalHR = totalHR + array_HR[i];
    }
    meanHR = totalHR / array_HR.length;
    meanHRLabel.text = meanHR;
    index_HR = 0;
    
    if (meanHR!=0){
      switch(stressState) {
        case "RELAXED":
            if ((currentStepCount - lastStepCount)>50){   //Considered exercise!
              stressState = "EXERCISE";
              stressLabel.text = "Exe";
              stressMsg.text = "";
              background2.style.fill = "red";
            }          
          
            if (meanHR>70){
              stressLabel.text = "Mild";
              stressState = "MILD";
              stressMsg.text = "Take a breather...";
              vibration.start("nudge");
              background2.style.fill = "yellow";
              stressLabel.style.fill = "black";
              stressMsg.style.fill = "black";
              meanHRLabel.style.fill = "black";
              sendEventIfReady("mild");
            }
            else if (meanHR>90){
              stressLabel.text = "Stressed";
              stressState = "STRESSED";
              stressMsg.text = "Take a break!";
              vibration.start("nudge-max");
              background2.style.fill = "orange";
              sendEventIfReady("stressed");
            }
            break;
        case "MILD":
            if ((currentStepCount - lastStepCount)>50){   //Considered exercise!
              stressState = "EXERCISE";
              stressLabel.text = "Exe";
              stressMsg.text = "";
              background2.style.fill = "red";
            }
            if (meanHR<=70){
              stressLabel.text = "Relaxed";
              stressState = "RELAXED";
              background2.style.fill = "green";
              sendEventIfReady("relaxed");
            }
            else if (meanHR>90){
              stressLabel.text = "Stressed";
              stressState = "STRESSED";
              stressMsg.text = "Take a break!";
              vibration.start("nudge-max");
              background2.style.fill = "orange";
              sendEventIfReady("stressed");
            }
            
            break;
        case "STRESSED":
          
            if ((currentStepCount - lastStepCount)>50){   //Considered exercise!
              stressState = "EXERCISE";
              stressLabel.text = "Exercise Detected";
              stressMsg.text = "";
              background2.style.fill = "red";
            }
          
            if (meanHR<=70){
              stressLabel.text = "Relaxed";
              stressState = "RELAXED";
              background2.style.fill = "green";
              sendEventIfReady("relaxed");
            }
            else if (meanHR<90){
              stressLabel.text = "Mild";
              stressState = "MILD";
              stressMsg.text = "Take a breather...";
              vibration.start("nudge");
              background2.style.fill = "yellow";
              stressMsg.style.fill = "black";
              stressLabel.style.fill = "black";
              meanHRLabel.style.fill = "black";
              sendEventIfReady("mild");
            }
            break;
          
        case "EXERCISE":
            if ((currentStepCount - lastStepCount)<=50){   //No longer Considered exercise!
              if (meanHR<=70){
                stressLabel.text = "Relaxed";
                stressState = "RELAXED";
                background2.style.fill = "green";
                sendEventIfReady("relaxed");
              }
              else if (meanHR<90){
                stressLabel.text = "Mild";
                stressState = "MILD";
                stressMsg.text = "Take a breather...";
                vibration.start("nudge");
                background2.style.fill = "yellow";
                stressLabel.style.fill = "black";
                stressMsg.style.fill = "black";
                meanHRLabel.style.fill = "black";
                sendEventIfReady("mild");
              }
              else {
                stressLabel.text = "Stressed";
                stressState = "STRESSED";
                stressMsg.text = "Take a break!";
                vibration.start("nudge-max");
                background2.style.fill = "orange";
                sendEventIfReady("stressed");
              }
            }
            break;
      }
    }
    lastStepCount = currentStepCount;
  }
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  timeLabel.text = `${hours}:${mins}`;
  
  dateText1.text = today.getDate() + " " + months[today.getMonth()];
  dateText2.text = days[today.getDay()];
}

// Begin monitoring the sensor
hrm.start();

function sendEventIfReady(eventName) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({eventName: eventName, meanHR: meanHR});
  }
}


