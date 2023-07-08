/* eslint-disable */
import axios from "axios";

interface VirusTotalResponse {
  data?: Object;
}

export const getVirusTotalResponse = async (
  search: string,
  apiKey: string,
  name: string,
) => {
  const url = `https://www.virustotal.com/api/v3/search?query=${search}`;
  return new Promise((resolve) => {
    axios
      .get<VirusTotalResponse>(url, {
        headers: {
          "x-apikey": apiKey,
        },
      })
      .then((data) => {
        resolve({
          name: name,
          data: data.data.data,
        });
      })
      .catch((error) => {
        resolve({
          name: name,
          data: error,
        });
      });
  });
};
