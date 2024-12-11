import * as contentful from "contentful";
export const client = contentful.createClient({
  space: "developer_bookshelf",
  accessToken: "0b7f6x59a0",
});

// client
//   .getEntry("5PeGS2SoZGSa4GuiQsigQu")
//   .then((entry) => console.log(entry))
//   .catch((err) => console.log(err));
