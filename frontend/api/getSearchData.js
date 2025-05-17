import axios from "axios";
let api_key = "AIzaSyD5-Ws019HoH0Cd_9ad-VWHDtMGQAxyZCA"

function getSearchData(query) {
  axios
    .get(`https://www.googleapis.com/youtube/v3/search?key=${api_key}&q=${query}&part=snippet&type=video&maxResults=5`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // handle error
    });
}

export default getSearchData;
