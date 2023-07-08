/* eslint-disable */
import axios from "axios";

// interface RunZeroResponse {
//   data?: Object;
// }

export const getRunZeroResponse = async (
  search: string,
  apiKey: string,
  name: string,
  type: string,
) => {
  const url = `https://console.runZero.com/api/v1.0/export/org/assets.json`;
  return new Promise((resolve, reject) => {
    axios
      .get<any>(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: {
          search:
            type === "ip"
              ? `alive:t address:${search}`
              : type === "hostname"
              ? `alive:t name:${search}`
              : `alive:t mac:${search}`,
        },
      })
      .then((data) => {
        resolve({
          name: name,
          data: data.data,
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
