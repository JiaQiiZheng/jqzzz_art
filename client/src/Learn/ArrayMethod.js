const items = [
  { name: "Bike", price: 100 },
  { name: "TV", price: 200 },
  { name: "Album", price: 10 },
  { name: "Book", price: 120 },
  { name: "Computer", price: 1200 },
  { name: "Key", price: 30 },
];

const itemsNum = [1, 2, 3, 4, 5];

// const filteredItems = items.filter((item) => {
//   if (item.price <= 100) {
//     return item;
//   }
// });

// const itemNames = items.map((item) => {
//   return item.name;
// });

// const foundItem = items.find((item) => {
//   return item.name === "Album";
// });

// const total = items.reduce((currentTotal, item) => {
//   return currentTotal + item.price;
// }, 0);

const includeAlbum = items.some((item) => {
  return item.name === "Album";
});

console.log(includeAlbum);
