"use strict";
const {
  dialogflow,
  List,
  Suggestions,
  LinkOutSuggestion,
  SimpleResponse
} = require("actions-on-google");
const app = dialogflow({ debug: true });
const functions = require("firebase-functions");

app.intent("New Welcome Intent", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `The GDG Ahmedabad Action welcomes you. How can I help you today?`,
      text: `The GDG Ahmedabad Action welcomes you. How can I help you today?`
    }),
    new Suggestions([`DevFest 2k18`, `About GDG Ahmedabad`, `WTM`])
  );
});

app.intent("AboutGDGIntent", conv => {
  conv.ask(
    `<speak> <sub alias="Google Developers Group">GDG</sub> Ahmedabad is open and volunteer geek community who create exciting projects and share experience about Google technologies with a passion.</speak>`
    // `<speak>Google Developers Group Ahmedabad is open and volunteer geek community who create exciting projects and share experience about Google technologies with a passion.</speak>`
  );
  conv.ask(new Suggestions(`Past Events`));
  /* Issue: not showing in suggestion chips */
  conv.ask(
    new LinkOutSuggestion({
      name: `GDG Abad Website`,
      openUrlAction: { url: "https://www.gdgahmedabad.com/" }
    })
  );
  /* Issue: while adding second LinkOutSuggestion it shows error */
  // conv.ask(
  //   new LinkOutSuggestion({
  //     name: "DevFest Website",
  //     url: "http://devfest.gdgahmedabad.com/"
  //   })
  // );
});

// https://firebase.google.com/docs/functions/write-firebase-functions
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
