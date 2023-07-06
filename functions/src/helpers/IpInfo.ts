/* eslint-disable */
import IPinfoWrapper from "node-ipinfo";

export const getIpInfoResponse = async (
  ipAddress: any,
  apiKey: string,
  name: string,
) => {
  const ipInfoWrapper = new IPinfoWrapper(apiKey);
  return new Promise(async (resolve, reject) => {
    ipInfoWrapper
      .lookupIp(ipAddress)
      .then((data) => {
        resolve({
          name: name,
          data: data,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
