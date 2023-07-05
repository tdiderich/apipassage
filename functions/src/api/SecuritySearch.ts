/* eslint-disable */
import * as functions from "firebase-functions";
import { getIpInfoResponse } from "../helpers/IpInfo";
import { getVirusTotalResponse } from "../helpers/VirusTotal";
const cors = require("cors")({ origin: true });

export const securitySearch = functions.https.onRequest(
  (request: any, response: any) => {
    cors(request, response, async () => {
      const ipAddress = request.query.ipAddress || "";
      let virusTotalResponse = {};
      let ipInfoResponse = {};
      await getVirusTotalResponse(ipAddress).then((response) => {
        virusTotalResponse = response.data;
      });
      getIpInfoResponse(ipAddress)
        .then((response) => {
          ipInfoResponse = response;
        })
        .then(() =>
          response.send({
            data: [
              { vendor: "IpInfo", data: ipInfoResponse },
              { vendor: "Virus Total", data: virusTotalResponse },
            ],
          }),
        );
    });
  },
);
