const committeeMembersData = require("./functions/data/aboutMembers.json");

function hello() {
  const name = "Paresh Mayani";
  const keys = Object.keys(committeeMembersData);
  // console.log("1");
  console.log(keys);
  // for (const key in keys) {
  //   console.log(key);
  //   if (key === name) {
  //     // console.log("3");
  //     console.log(`${key} found`);
  //     console.log(committeeMembersData[keys][intro]);
  //   }
  // console.log("4");
  // }
  keys.forEach(key => {
    if (key === name) {
      console.log(`${key} found`);
      console.log(committeeMembersData[`${key}`]["intro"]);
    }
  });
}
hello();
