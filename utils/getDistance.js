const axios = require("axios");

const { GOOGLE_API_KEY } = process.env;

module.exports = async (originStr, destinationStr) => {
  let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

  let params = `origins=${originStr}&destinations=${destinationStr}&key=${GOOGLE_API_KEY}`; // you need to get a key
  let finalApiURL = `${ApiURL}${encodeURI(params)}`;

  let result = await axios.get(finalApiURL); // call API
  const distance = result.data.rows[0].elements[0].distance;
  console.log(JSON.stringify(result.data.rows), "output");
  return distance;
};
