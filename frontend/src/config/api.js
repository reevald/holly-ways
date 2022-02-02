// Create and export API config
export const API = () => {
  const baseUrl = "http://localhost:5000/api/v1"

  // Ref: https://www.geeksforgeeks.org/javascript-fetch-method/
  // Params options (config) to be given as parameter
  // in fetch for making requests other than GET
  // E.g : (Remember Http have structur)
  // config = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json;charset=utf-8'
  //   },
  //   body: JSON.stringify(<data>)
  // }

  const executeAPI = async (endpoint, config) => {
    const response = await fetch(baseUrl + endpoint, config);
    const data = await response.json();
    return data;
  }

  return {
    get: executeAPI,
    post: executeAPI,
    patch: executeAPI,
    delete: executeAPI
  }
}