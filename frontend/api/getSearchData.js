import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

async function getSearchData(query) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}&part=snippet&type=video&maxResults=4`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // optional: return null to handle gracefully
  }
}

export default getSearchData;
