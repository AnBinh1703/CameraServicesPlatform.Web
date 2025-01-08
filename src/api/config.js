import axios from "axios";
//const baseUrl = "http://localhost:5275";
const baseUrl = "http://14.225.220.108:2602";
const config = {
  baseUrl,
  timeout: 300000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;
const handleBefore = (config) => {
  const token = localStorage.getItem("accessToken")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};
const handleError = (error) => {
  console.log(error);
  return;
};
api.interceptors.request.use(handleBefore, handleError);
// api.interceptors.response.use(null, handleError);

export default api;
//import axios from "axios";

// const baseUrl = "http://localhost:5275";
// const baseUrl =
//   "https://cors-anywhere.herokuapp.com/http://14.225.220.108:2602";

// const config = {
//   baseURL: baseUrl,
//   timeout: 300000,
//   headers: {
//     "x-requested-with": "XMLHttpRequest", // Thêm header này để yêu cầu hợp lệ
//   },
// };

// const api = axios.create(config);

// const handleBefore = (config) => {
//   const token = localStorage.getItem("accessToken")?.replaceAll('"', "");
//   config.headers["Authorization"] = `Bearer ${token}`;
//   config.headers["origin"] = window.location.origin; // Thêm header origin
//   return config;
// };

// const handleError = (error) => {
//   console.log(error);
//   return;
// };

// api.interceptors.request.use(handleBefore, handleError);

// export default api;
