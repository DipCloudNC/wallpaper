import axios from "axios";

const API_KEY = "45741163-7e1c355278b1b5c73be41e07e";
const API_Url = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => {
  let url = API_Url + "&per_page=25 safesearch=true&editors_choice=true";
  if (!params) return url;
  let paramsKeys = Object.keys(params);
  paramsKeys.map((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  // console.log("final url: " + url);
  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatUrl(params));
    const { data } = response;
    return { sucess: true, data };
  } catch (error) {
    console.error("got error: ", error.message);
    return { sucess: false, message: error.message };
  }
};
