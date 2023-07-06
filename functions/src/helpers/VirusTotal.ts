/* eslint-disable */
import axios from "axios";

interface VirusTotalResponse {
  data?: Object;
}

export const getVirusTotalResponse = async (
  ipAddress: string,
  apiKey: string,
  name: string,
) => {
  const url = `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`;
  return new Promise((resolve, reject) => {
    axios
      .get<VirusTotalResponse>(url, {
        headers: {
          "x-apikey": apiKey,
        },
      })
      .then((data) => {
        resolve({
          name: name,
          data: data.data,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
