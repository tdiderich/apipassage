/* eslint-disable */
import IPinfoWrapper from "node-ipinfo";

export const getIpInfoResponse = async (
  ipAddress: any,
  apiKey: string,
  name: string,
  type: string,
) => {
  const ipInfoWrapper = new IPinfoWrapper(apiKey);
  return new Promise(async (resolve) => {
    if (type !== "ip") {
      resolve({
        name: name,
        data: { error: "Only IP search type supported for IPInfo" },
      });
    }
    ipInfoWrapper
      .lookupIp(ipAddress)
      .then((data) => {
        resolve({
          name: name,
          data: data,
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
