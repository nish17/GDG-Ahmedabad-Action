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
    new Suggestions([`meet the team`, `DevFest 2018`]),
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
      `Venue`,
      `Swags`
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
  const eventType = params.eventType;
  if (eventType === "MOBILE") {
    conv.close(`<speak>Events of mobile track will be announced soon</speak>`);
  } else if (eventType === "WEB") {
    conv.close(`<speak>Events of web track will be announced soon</speak>`);
  } else {
    conv.close(`<speak>Events will be announced soon</speak>`);
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
          description: "Co-organizer at GDG Ahmedabad",
          image: new Image({
            url:
              "https://pbs.twimg.com/profile_images/898486597175263232/U_9clmww_400x400.jpg",
            alt: "Jaldeep Asodariya's Picture"
          })
        },
        DHRUVA_SHASTRI: {
          synonyms: ["Dhruva Shastri", "Dhruva madam", "Shastri madam"],
          title: "Dhruva Shastri",
          description: "Co-organizer at GDG Ahmedabad and leads WTM Ahmedabad",
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
    new Suggestions([
      `Register for devfest`,
      `List of Speakers`,
      `Technologies`
    ]),
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
});

app.intent("VenueIntent", conv => {
  conv.ask(
    new SimpleResponse({
      speech: `This year's GDG ahmedabad's devfest is hosted at Courtyard by Mariott`,
      text: `This year's GDG ahmedabad's devfest is hosted at Courtyard by Mariott`
    }),
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
    new SimpleResponse({
      speech: `Now you can ask me anything else you want to know about Devfest`,
      text: `Now you can ask me anything else you want to know about Devfest`
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
    new Suggestions([`Mobile Track`, `Web Track`])
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
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
