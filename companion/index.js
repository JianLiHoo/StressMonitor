import * as messaging from "messaging";
import { settingsStorage } from "settings";

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data) {
    let apiKey = settingsStorage.getItem("apiKey");
    let eventName = evt.data.eventName;
    let meanHR = evt.data.meanHR;
    console.log("mean: " + meanHR)
    let data = "value1=" + meanHR; // + "&value2=" + dsgfdfg;
    if (eventName && apiKey) {
      apiKey = JSON.parse(apiKey).name;
      let url = `https://maker.ifttt.com/trigger/${eventName}/with/key/${apiKey}`
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded"},
        body: data
      });
    }
  }
});