/* eslint-disable */
import axios from "axios";

interface VirusTotalResponse {
  data?: Object;
}

export const getVirusTotalResponse = async (ipAddress: any) => {
  const url = `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`;
  return axios.get<VirusTotalResponse>(url, {
    headers: {
      "x-apikey":
        "0905fe98668e03f9018aace7e078713d27a438924b596149b5c531ebd20aa8d0",
    },
  });
};
