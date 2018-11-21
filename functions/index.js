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
const Speakers = require("./data/Speakers.json");
const Mobile = require("./data/mobile.json");
const Web = require("./data/web.json");
const CodeLab = require("./data/codeLab.json");

const { google } = require("googleapis");
const key = require("./data/gdg-ahmedabad-devfest-a2262e8f1dee.json");

let jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/actions.fulfillment.conversation"],
  null
);

jwtClient.authorize((err, tokens) => {
  // code to retrieve target userId and intent
  if (err) {
    console.log(`Something went wrong ${err}`);
  }
  let notif = {
    userNotification: {
      title: "DevFest 2k18 Events Update"
    },
    target: {
      userId: "<USER_ID>",
      intent: "<INTENT>",
      // Expects a IETF BCP-47 language code (i.e. en-US)
      locale: "en-US"
    }
  };

  request.post(
    "https://actions.googleapis.com/v2/conversations:send",
    {
      auth: {
        bearer: tokens.access_token
      },
      json: true,
      body: { customPushMessage: notif }
    },
    (err, httpResponse, body) => {
      if (!err)
        console.log(
          httpResponse.statusCode + ": " + httpResponse.statusMessage
        );
    }
  );
});

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
    new Suggestions([`meet the team`, `DevFest 2018`, `contribute`]),
    new LinkOutSuggestion({
      name: `PastEvents Highlight`,
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
    new Suggestions([
      `List of Web Events`,
      `List of Mobile Events`,
      `List of CodeLabs`,
      `Venue`,
      `Swags`,
      `Women Speakers`,
      `Speakers of DevFest 2018`
    ]),
    new LinkOutSuggestion({
      name: `Navigate to Venue`,
      url: "https://goo.gl/maps/wcJ3dEjWKQs"
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
    new Suggestions([`About Dhruva Shastri`, `Exit`])
  );
});

app.intent("eventIntent", (conv, params) => {
  // const eventType = conv.body.queryResult.parameters.eventType;
  const result = {
    title: ``,
    items: {}
  };
  const eventType = params.eventType;
  result.title = `${eventType}`;
  if (eventType === "MOBILE") {
    const dataArray = Object.entries(Mobile);
    for (const data of dataArray) {
      const key = data[0];
      const value = data[1];
      result.items[`${value.title} ${key}`] = {
        synonyms: [`${value.title}, ${value.time}`],
        title: `At ${value.time}: ${value.title}`,
        description: `${value.speaker ? value.speaker + "," : ""} Duration:${
          value.duration
        }`
      };
    }
    conv.ask(`<speak>Events of Mobile Track </speak>`);
    conv.ask(
      new List(result),
      new Suggestions([`web track`, `CodeLab schedule`])
    );
    // conv.ask(new Suggestions(`send me talk updates`));
  } else if (eventType === "WEB") {
    const dataArray = Object.entries(Web);
    for (const data of dataArray) {
      const key = data[0];
      const value = data[1];
      result.items[`${value.title} ${key}`] = {
        synonyms: [`${value.title}, ${value.time}`],
        title: `At ${value.time}: ${value.title}`,
        description: `${value.speaker ? value.speaker + "," : ""} Duration:${
          value.duration
        }`
      };
    }
    conv.ask(`<speak>Events of Web track</speak>`);
    conv.ask(
      new List(result),
      new Suggestions([`mobile track`, `CodeLab schedule`])
    );
    // conv.ask(new Suggestions(`send me talk updates`));
  } else if (eventType === "CODELAB") {
    const dataArray = Object.entries(CodeLab);
    for (const data of dataArray) {
      const key = data[0];
      const value = data[1];
      result.items[`${value.title} ${key}`] = {
        synonyms: [`${value.title}, ${value.time}`],
        title: `At ${value.time}: ${value.title}`,
        description: `${value.speaker ? value.speaker + "," : ""} Duration:${
          value.duration
        }`
      };
    }
    conv.ask(`<speak>CodeLabs Schedule</speak>`);
    conv.ask(new List(result), new Suggestions([`mobile track`, `web track`]));
    // conv.ask(new Suggestions(`send me talk updates`));
  }
});

app.intent("event_notification_setup_push", conv => {
  conv.ask(new UpdatePermission({ intent: "eventIntent" }));
});

app.intent("FinishEventSetupPush", (conv, params) => {
  if (conv.arguments.get("PERMISSION")) {
    //const userID = conv.user.id;
    const userID = conv.arguments.get("UPDATES_USER_ID");
    // code to save intent and userID in your db
    conv.close(`Ok, I'll start alerting you.`);
  } else {
    conv.close(`Ok, I won't alert you.`);
  }
});

app.intent("gdgCommittee", (conv, params) => {
  // const name = conv.body.queryResult.parameters.committeeMembers;
  const name = params.committeeMembers;
  const keys = Object.keys(committeeMembersData);
  let handleNotFound = 1;
  keys.forEach(key => {
    if (key === name) {
      handleNotFound = 0;
      // console.log(`${key} found`);
      // console.log(committeeMembersData[`${key}`]["intro"]);
      conv.ask(`<speak>${name}'s Profile.</speak>`);
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
  // if (handleNotFound) {
  //   conv.ask(
  //     `<speak>I'm Sorry!, Seems like I'll have to update my database soon!</speak>`
  //   );
  // }
  conv.ask(
    new Suggestions([
      `About Paresh Mayani`,
      `About Dhrumil Shah`,
      `About Chintan Rathod`,
      `About Jaldeep Asodariya`,
      `About Dhurva Shastri`,
      `About Utpal Betai`,
      `About Pratik Patel`
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
          description: "Founder of GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/447806646228488193/52264v-L_400x400.jpeg",
            alt: "Paresh Mayani's Picture"
          })
        },
        DHRUMIL_SHAH: {
          synonyms: ["Dhrumil Shah", "Dhrumil Sir", "Shah Sir"],
          title: "Dhrumil Shah",
          description: "Co-organizer at GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/654186562230468608/xEBDps3u_400x400.jpg",
            alt: "Dhrumil Shah's Picture"
          })
        },
        CHINTAN_RATHOD: {
          synonyms: ["Chintan Rathod", "Chintan Sir", "Rathod Sir"],
          title: "Chintan Rathod",
          description: "Co-organizer at GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/987564553536921600/HMQDpWmE_400x400.jpg",
            alt: "Chintan Rathod's Picture"
          })
        },
        JALDEEP_ASODARIYA: {
          synonyms: ["Jaldeep Asodariya", "Jaldeep sir", "Asodariya sir"],
          title: "Jaldeep Asodariya",
          description: "Core organizer at GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/898486597175263232/U_9clmww_400x400.jpg",
            alt: "Jaldeep Asodariya's Picture"
          })
        },
        DHRUVA_SHASTRI: {
          synonyms: ["Dhruva Shastri", "Dhruva madam", "Shastri madam"],
          title: "Dhruva Shastri",
          description: "Leads WTM Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/972084540679241729/XyWmFtij_400x400.jpg",
            alt: "Dhruva Shastri's Picture"
          })
        },
        PRATIK_PATEL: {
          synonyms: ["Pratik Patel", "Pratik sir", "Patel Sir"],
          title: "Pratik Patel",
          description: "Co-organizer at GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/1011441747073757184/QYXDujoz_400x400.jpg",
            alt: "Pratik Patel's Picture"
          })
        },
        UTPAL_BETAI: {
          synonyms: ["Utpal Betai", "Utpal sir", "Betai Sir"],
          title: "Utpal Betai",
          description: "Assistant organizer at GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/886454117534531584/IJh9MqIa_400x400.jpg",
            alt: "Uptal Betai's Picture"
          })
        }
      }
    }),
    new Suggestions([
      `About Paresh Mayani`,
      `About Dhrumil Shah`,
      `About Chintan Rathod`,
      `About Jaldeep Asodariya`,
      `About Dhurva Shastri`,
      `About Utpal Betai`,
      `About Pratik Patel`
    ])
  );
});

const SELECTED_ITEM_RESPONSES = {
  PARESH_MAYANI: "Paresh Mayani",
  DHRUMIL_SHAH: "Dhrumil Shah",
  CHINTAN_RATHOD: "Chintan Rathod",
  JALDEEP_ASODARIYA: "Jaldeep Asodariya",
  DHRUVA_SHASTRI: "Dhruva Shastri",
  PRATIK_PATEL: "Pratik Patel",
  UTPAL_BETAI: "Utpal Betai"
};

app.intent("EventDates", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `This year GDG Ahmedabad's DevFest is on 25th November 2018 and the venue is Courtyard by Mariott Ahmedabad`,
      text: `GDG Ahmedabad's DevFest 2018 is on 25th November 2018 and the venue is Courtyard by Mariott Ahmedabad`
    }),
    new Suggestions([`List of Speakers`, `Technologies`]),
    new LinkOutSuggestion({
      name: `Navigate to Venue`,
      url: "https://goo.gl/maps/wcJ3dEjWKQs"
    })
  );
});

// function getInfoHelper(conv, name) {
//   return conv.ask(
//     new SimpleResponse({
//       speech: `${name}'s Profile.`,
//       text: `${name}'s Profile.`
//     }),
//     // `<speak>${name}'s Profile.</speak>`,
//     new BasicCard({
//       text: committeeMembersData[`${name}`]["intro"],
//       subtitle: `About`,
//       title: key,
//       buttons: new Button({
//         title: "Visit LinkedIN Profile",
//         url: committeeMembersData[`${name}`]["linkedin"]
//       }),
//       image: new Image({
//         url: committeeMembersData[`${name}`]["image"],
//         alt: "Profile Picture"
//       }),
//       display: "CROPPED"
//     })
//   );
// }

app.intent("GetInfo", (conv, params, option) => {
  // let response = "You did not select any item";
  // console.log(`$$$$$`);
  // console.log(SELECTED_ITEM_RESPONSES.hasOwnProperty(option));
  // console.log(option);
  // console.log(SELECTED_ITEM_RESPONSES[option]);
  // if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
  // response = SELECTED_ITEM_RESPONSES[option];
  // const name = SELECTED_ITEM_RESPONSES[option];
  // const keys = Object.keys(committeeMembersData);
  // for (let i = 0; i < SELECTED_ITEM_RESPONSES.length; i++) {
  let name = "";
  if (option === PARESH_MAYANI) {
    name = "Paresh Mayani";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Paresh Mayani");
    // conv.ask(`<speak>${name}'s Profile.</speak>`);
  } else if (option === DHRUMIL_SHAH) {
    name = "Dhrumil Shah";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Dhrumil Shah");
  } else if (option === CHINTAN_RATHOD) {
    name = "Chintan Rathod";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Chintan Rathod");
  } else if (option === JALDEEP_ASODARIYA) {
    name = "Jaldeep Asodariya";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Jaldeep Asodariya");
  } else if (option === DHRUVA_SHASTRI) {
    name = "Dhruva Shastri";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Dhruva Shastri");
  } else if (option === UTPAL_BETAI) {
    name = "Utpal Betai";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Utpal Betai");
  } else if (option === PRATIK_PATEL) {
    name = "Pratik Patel";
    conv.ask(
      new SimpleResponse({
        speech: `${name}'s Profile.`,
        text: `${name}'s Profile.`
      }),
      // `<speak>${name}'s Profile.</speak>`,
      new BasicCard({
        text: committeeMembersData[`${name}`]["intro"],
        subtitle: `About`,
        title: key,
        buttons: new Button({
          title: "Visit LinkedIN Profile",
          url: committeeMembersData[`${name}`]["linkedin"]
        }),
        image: new Image({
          url: committeeMembersData[`${name}`]["image"],
          alt: "Profile Picture"
        }),
        display: "CROPPED"
      })
    );
    // getInfoHelper(conv, "Pratik Patel");
    // }
  }
  // keys.forEach(key => {
  //   if (key === name) {
  //     // console.log(`${key} found`);
  //     // console.log(committeeMembersData[`${key}`]["intro"]);
  //     conv.ask(`<speak>${name}'s Profile.</speak>`);
  //     conv.ask(
  //       new BasicCard({
  //         text: committeeMembersData[`${key}`]["intro"],
  //         subtitle: `About`,
  //         title: key,
  //         buttons: new Button({
  //           title: "Visit LinkedIN Profile",
  //           url: committeeMembersData[`${key}`]["linkedin"]
  //         }),
  //         image: new Image({
  //           url: committeeMembersData[`${key}`]["image"],
  //           alt: "Profile Picture"
  //         }),
  //         display: "CROPPED"
  //       })
  //     );
  //     // break;
  //   }
  // });
  // }
  // conv.ask(response);
  conv.ask(new Suggestions([`list of web events`,`list of mobile events`,`CodeLab Schedule`]))
});

app.intent("VenueIntent", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `This year's GDG ahmedabad's devfest is hosted at Courtyard by Mariott`,
      text: `This year's GDG ahmedabad's devfest is hosted at Courtyard by Mariott`
    }),
    new Suggestions([
      `list of web events`,
      `list of mobile events`,
      `CodeLab Schedule`
    ]),
    new LinkOutSuggestion({
      name: `Navigate to Venue`,
      url: "https://goo.gl/maps/wcJ3dEjWKQs"
    })
  );
});

app.intent("SwagIntent", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `Attendees this year will get DevFest Tshirt and a badge`,
      text: `Attendees this year will get DevFest Tshirt and a badge`
    }),
    new Suggestions([`Search for talks`, `Venue`, `Register for DevFest`])
  );
});

app.intent("SessionsIntent", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `Which topic are you interested in?`,
      text: `Which topic are you interested in?`
    }),
    new Suggestions([`Mobile Track`, `Web Track`, `Codelabs sessions`])
  );
});

app.intent("OrganizerIntent", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `GDG Ahmedabad will host the event and GDG ahmedabad along with WTM ahmedabad will organize this year's devfest`,
      text: `GDG Ahmedabad will host the event and GDG ahmedabad along with WTM ahmedabad will organize this year's devfest`
    }),
    new Suggestions([`Venue`, `Swag this year`, `Browse talks`]),
    new LinkOutSuggestion({
      name: `Navigate to Venue`,
      url: "https://goo.gl/maps/wcJ3dEjWKQs"
    })
  );
});

app.intent("SpeakersIntent", conv => {
  const result = {
    title: `List of Speakers`,
    items: {}
  };
  const dataArray = Object.entries(Speakers);
  for (const data of dataArray) {
    const key = data[0];
    const value = data[1];
    result.items[`${key}`] = {
      synonyms: [`${key}`, `${value.intro}`],
      title: `${value.type}: ${value.topic} By ${key}`,
      description: `${key}, ${value.intro}`,
      image: new Image({
        url: `${value.image}`,
        alt: `${key}'s Picture`
      })
    };
  }
  conv.ask("<speak>Here are the Speakers of Devfest 2018</speak>");
  conv.ask(new List(result), new Suggestions(`Women Speakers`,`Browse talks`));
});

app.intent("WomenInTech", conv => {
  const result = {
    title: `List of Women Speakers`,
    items: {}
  };
  const dataArray = Object.entries(Speakers);
  for (const data of dataArray) {
    const key = data[0];
    const value = data[1];
    if (value.gender === "Female")
      result.items[`${key}`] = {
        synonyms: [`${key}`, `${value.intro}`],
        title: `${value.type}: ${value.topic} By ${key}`,
        description: `${key}, ${value.intro}`,
        image: new Image({
          url: `${value.image}`,
          alt: `${key}'s Picture`
        })
      };
  }
  conv.ask("<speak>Here are the Women Speakers of Devfest 2018</speak>");
  conv.ask(new List(result), new Suggestions(`All Speakers`,`Browse talks`));
});

app.intent("ContributeIntent", conv => {
  conv.ask("More information about contribution");
  conv.ask(
    new BasicCard({
      text: `GDG Ahmedabad is open and volunteer geek community who create exciting projects and share experience about Google technologies with a passion`,
      subtitle: "Founded and Organized by Paresh Mayani",
      title: "Contribute to GDG Ahmedabad",
      buttons: new Button({
        title: "Visit Website",
        url: "https://github.com/GDGAhmedabad"
      }),
      image: new Image({
        url: "https://avatars1.githubusercontent.com/u/16831892?s=280&v=4",
        alt: "GDG Ahmedabad Icon"
      }),
      display: "CROPPED"
    })
  );
  conv.ask(
    new Suggestions([`meet the team`, `DevFest 2018`]),
    new LinkOutSuggestion({
      name: `PastEvents Highlight`,
      url: "https://www.meetup.com/GDG-Ahmedabad/events/past/"
    })
  );
});

// https://firebase.google.com/docs/functions/write-firebase-functions

// app.fallback(conv => {
//   // intent contains the name of the intent
//   // you defined in the Intents area of Dialogflow
//   const intent = conv.intent;
//   switch (intent) {
//     case WELCOME_INTENT:
//       conv.ask("Welcome! Say a number.");
//       break;

//     case NUMBER_INTENT:
//       const num = conv.arguments.get(NUMBER_ARGUMENT);
//       conv.close(`You said ${num}`);
//       break;
//   }
// });

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
