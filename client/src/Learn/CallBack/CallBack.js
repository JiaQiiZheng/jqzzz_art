const userLeft = false;
const userWatchingCatMeme = true;

// function WatchTutorialCallBack(callback, errorCallback) {
//   if (userLeft) {
//     errorCallback({
//       name: "User Left",
//       message: ":(",
//     });
//   } else if (userWatchingCatMeme) {
//     errorCallback({
//       name: "User Watching Cat Meme",
//       message: "Web < Cat",
//     });
//   } else {
//     callback("Thumbs up and Subscribe");
//   }
// }

// WatchTutorialCallBack(
//   (message) => {
//     console.log("Success: " + message);
//   },
//   (error) => {
//     console.log(error.name + " " + error.message);
//   }
// );

function WatchTutorialPromise() {
  return new Promise((resolve, reject) => {
    if (userLeft) {
      reject({
        name: "User Left",
        message: ":(",
      });
    } else if (userWatchingCatMeme) {
      reject({
        name: "User Watch Cat",
        message: "web < cat",
      });
    } else {
      resolve("Subscribe Web");
    }
  });
}

WatchTutorialPromise()
  .then((message) => {
    console.log("This is in then: " + message);
  })
  .catch((error) => {
    console.log("This is in catch: " + error.message);
  });
// function WatchTutorialPromise() {
//   return new Promise((resolve, reject) => {
//     if (userLeft) {
//       reject({
//         name: "User Left",
//         message: ":(",
//       });
//     } else if (userWatchingCatMeme) {
//       reject({
//         name: "User Watching Cat Meme",
//         message: "Web < Cat",
//       });
//     } else {
//       resolve("Subscribe");
//     }
//   });
// }

// WatchTutorialPromise()
//   .then((message) => {
//     console.log("This is in then: " + message);
//   })
//   .catch((error) => {
//     console.log("This is in catch: " + error.name + " " + error.message);
//   });

// const recordVideoOne = new Promise((resolve, reject) => {
//   resolve("Video 1 Recorded");
// });
// const recordVideoTwo = new Promise((resolve, reject) => {
//   resolve("Video 2 Recorded");
// });
// const recordVideoThree = new Promise((resolve, reject) => {
//   resolve("Video 3 Recorded");
// });

// Promise.race([recordVideoOne, recordVideoTwo, recordVideoThree]).then(
//   (message) => {
//     console.log(message);
//   }
// );
