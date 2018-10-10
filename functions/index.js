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
const committeeMembersData = require("./data/aboutMembers.json");

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
    new Suggestions([`meet the team`, `DevFest 2018`, `Exit`]),
    new LinkOutSuggestion({
      name: `Past Events`,
      url: "https://www.meetup.com/GDG-Ahmedabad/events/past/"
    })
  );
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

app.intent("gdgCommittee", conv => {
  const name = conv.body.queryResult.parameters.committeeMembers;
  const keys = Object.keys(committeeMembersData);
  keys.forEach(key => {
    if (key === name) {
      // console.log(`${key} found`);
      // console.log(committeeMembersData[`${key}`]["intro"]);
      conv.ask(`<speak>Here you go.</speak>`);
      conv.ask(
        new BasicCard({
          text: committeeMembersData[`${key}`]["intro"],
          subtitle: `About`,
          title: key,
          buttons: new Button({
            title: "Visit LinkedIN Profile",
            url: committeeMembersData[`${key}`]["linkedin"]
          }),
          image: new Image({
            url: committeeMembersData[`${key}`]["image"],
            alt: "Profile Picture"
          }),
          display: "CROPPED"
        })
      );
      // break;
    }
  });
  conv.ask(
    new Suggestions([
      `Paresh Mayani`,
      `Dhrumil Shah`,
      `Chintan Rathod`,
      `Jaldeep Asodariya`,
      `Dhurva Shastri`,
      `Utpal Betai`,
      `Pratik Patel`
    ])
  );
});

app.intent("getAllMembers", conv => {
  conv.ask("List of all GDG Ahmedabad Committee Members");
  conv.ask(
    new List({
      title: "Committee Members",
      items: {
        PARESH_MAYANI: {
          synonyms: ["Paresh Mayani", "Paresh Sir", "Mayani Sir"],
          title: "Paresh Mayani",
          description: "Founder of GDG Ahmedabad"
        },
        DHRUMIL_SHAH: {
          synonyms: ["Dhrumil Shah", "Dhrumil Sir", "Shah Sir"],
          title: "Dhrumil Shah",
          description: "Co-organizer at GDG Ahmedabad"
        },
        CHINTAN_RATHOD: {
          synonyms: ["Chintan Rathod", "Chintan Sir", "Rathod Sir"],
          title: "Chintan Rathod",
          description: "Co-organizer at GDG Ahmedabad"
        },
        JALDEEP_ASODARIYA: {
          synonyms: ["Jaldeep Asodariya", "Jaldeep sir", "Asodariya sir"],
          title: "Jaldeep Asodariya",
          description: "Co-organizer at GDG Ahmedabad"
        },
        DHRUVA_SHASTRI: {
          synonyms: ["Dhruva Shastri", "Dhruva madam", "Shastri madam"],
          title: "Dhruva Shastri",
          description: "Co-organizer at GDG Ahmedabad and leads WTM Ahmedabad"
        },
        PRATIK_PATEL: {
          synonyms: ["Pratik Patel", "Pratik sir", "Patel Sir"],
          title: "Pratik Patel",
          description: "Co-organizer at GDG Ahmedabad"
        },
        UTPAL_BETAI: {
          synonyms: ["Utpal Betai", "Utpal sir", "Betai Sir"],
          title: "Utpal Betai",
          description: "Assistant organizer at GDG Ahmedabad"
        }
      }
    }),
    conv.ask(
      new Suggestions([
        `Paresh Mayani`,
        `Dhrumil Shah`,
        `Chintan Rathod`,
        `Jaldeep Asodariya`,
        `Dhurva Shastri`,
        `Utpal Betai`,
        `Pratik Patel`
      ])
    )
  );
});

// https://firebase.google.com/docs/functions/write-firebase-functions

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
