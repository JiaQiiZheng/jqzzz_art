let p = new Promise((resolve, reject) => {
  let verification = 1 + 1;
  if (verification == 2) {
    resolve("Success");
  } else {
    reject("Failed");
  }
});

p.then((message) => {
  console.log("This is in the then: " + message);
}).catch((message) => {
  console.log("This is in the catch: " + message);
});
