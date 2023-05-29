//get section name
const currentUrlArray = window.location.href.split("/");
const sectionName = currentUrlArray[currentUrlArray.length - 1];

function generateObj(url) {
  const urlObj = { src: url };
  return urlObj;
}
function GetImages() {
  var imageUrls = [];
  fetch(`${process.env.REACT_APP_API_URL}/post/${sectionName}`).then(
    (response) => {
      response.json().then((posts) =>
        posts.forEach((post) => {
          imageUrls.push(generateObj(post.cover));
        })
      );
    }
  );
  return imageUrls;
}

const data = GetImages();

export { data };
