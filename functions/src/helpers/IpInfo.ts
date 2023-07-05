/* eslint-disable */
import IPinfoWrapper from "node-ipinfo";

export const getIpInfoResponse = async (ipAddress: any) => {
  const ipInfoWrapper = new IPinfoWrapper("dce010faf221c7");
  return ipInfoWrapper.lookupIp(ipAddress);
};
