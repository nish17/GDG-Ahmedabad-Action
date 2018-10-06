"use strict";
const {
  dialogflow,
  List,
  BasicCard,
  Suggestions,
  Button,
  Image,
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
  // conv.ask(
  //   `<speak> <sub alias="Google Developers Group">GDG</sub> Ahmedabad is open and volunteer geek community who create exciting projects and share experience about Google technologies with a passion.</speak>`
  // );
  conv.ask(`<speak>Here's the information about GDG Ahmedabad</speak>`);
  conv.ask(
    new BasicCard({
      text: `GDG Ahmedabad is open and volunteer geek community who create exciting projects and share experience about Google technologies with a passion`,
      subtitle: "Founded and Organized by Paresh Mayani",
      title: "About GDG Ahmedabad",
      buttons: new Button({
        title: "Visit Website",
        url: "https://www.gdgahmedabad.com/"
      }),
      image: new Image({
        url: "https://avatars1.githubusercontent.com/u/16831892?s=280&v=4",
        alt: "GDG Ahmedabad Icon"
      }),
      display: "CROPPED"
    })
  );

  conv.ask(
    new Suggestions([`DevFest 2018`, `Exit`]),
    new LinkOutSuggestion({
      name: `Past Events`,
      url: "https://www.meetup.com/GDG-Ahmedabad/events/past/"
    })
  );
  // /* Issue: not showing in suggestion chips */
  // conv.ask(
  //   new LinkOutSuggestion({
  //     name: `Meetup Website`,
  //     url: "https://www.meetup.com/GDG-Ahmedabad/"
  //   })
  // );
  // conv.ask(
  //   new LinkOutSuggestion({
  //     name: `GDG Abad Website`,
  //     url: "https://www.gdgahmedabad.com/"
  //   })
  // );
  /* Issue: while adding second LinkOutSuggestion it shows error */
  // conv.ask(
  //   new LinkOutSuggestion({
  //     name: "DevFest Website",
  //     url: "http://devfest.gdgahmedabad.com/"
  //   })
  // );
});

app.intent("DevFestIntent", conv => {
  conv.ask(`<speak>Here's the information about DevFest</speak>`);
  conv.ask(
    new BasicCard({
      text: `DevFests are community-led, developer events hosted by GDG chapters around the globe focused on community building and learning about Google’s technologies.`,
      subtitle: "Happens during August 1 — November 30, 2018",
      title: "About DevFest",
      buttons: new Button({
        title: "Visit Website",
        url: "http://devfest.gdgahmedabad.com/"
      }),
      image: new Image({
        url: "https://avatars1.githubusercontent.com/u/16831892?s=280&v=4",
        alt: "DevFest Icon"
      }),
      display: "CROPPED"
    })
  );
  conv.ask(
    new Suggestions([`List of Day 1 Events`, `List of Day 2 Events`]),
    new LinkOutSuggestion({
      name: `DevFest 2018 Website`,
      url: "http://devfest.gdgahmedabad.com/"
    })
  );
});

app.intent("WTMInfo", conv => {
  conv.ask(
    `<speak>Here's the information about <sub alias="Women Tech Makers">WTM</sub></speak>`
  );
  conv.ask(
    new BasicCard({
      text: `A community encouraging women in tech, making Ahmedabad tech community diverse & comprehensive, share knowledge and passion through sessions, talks, workshops.`,
      subtitle: "Dhurva Shastri leads Women Tech Makers Ahmedabad",
      title: "About WTM",
      buttons: new Button({
        title: "Visit Website",
        url: "https://www.womentechmakers.com/"
      }),
      image: new Image({
        url:
          "https://lh4.googleusercontent.com/m-macIPNQbE_Z1tSdViidBMEcCWF6n0dEk5XIIFWclIAnmgGGfnMCgphlxKdmflFuBqYtQ=w1200-h630-p",
        alt: "WTM Icon"
      }),
      display: "WHITE"
    })
  );
  // conv.ask(new Suggestions([`List of Day 1 Events`, `List of Day 2 Events`]));
  conv.ask(
    new LinkOutSuggestion({
      name: "Twitter: WTM A'bad",
      url: "https://www.twitter.com/wtmahmedabad"
    }),
    new Suggestions(`Exit`)
  );
});

app.intent("eventIntent", conv => {
  const dayNumber = conv.body.queryResult.parameters.dayNumber;
  if (dayNumber === "day1") {
    conv.close(`<speak>Events of day 1 will be announced soon</speak>`);
  } else if (dayNumber === "day2") {
    conv.close(`<speak>Events of day 2 will be announced soon</speak>`);
  } else {
    conv.close(`<speak>Events will be announced soon</speak>`);
  }
});

// https://firebase.google.com/docs/functions/write-firebase-functions

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
