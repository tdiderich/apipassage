/* eslint-disable */
import * as functions from "firebase-functions";
import { getIpInfoResponse } from "../helpers/IpInfo";
import { getVirusTotalResponse } from "../helpers/VirusTotal";
const cors = require("cors")({ origin: true });

export const securitySearch = functions.https.onRequest(
  (request: any, response: any) => {
    cors(request, response, async () => {
      const type = request.query.type;
      const search = request.query.search;
      const credentials = request.query.credentials;

      if (type && search && credentials) {
        let data: any = {};

        await credentials.forEach(
          async (
            cred: { type: string; name: string; apiKey: string },
            i: number,
          ) => {
            if (cred.type == "ip-info") {
              await getIpInfoResponse(search).then((response) => {
                const name = cred.name || `ip-info-${i}`;
                data[name] = response;
              });
            } else if (cred.type == "virus-total") {
              await getVirusTotalResponse(search).then((response) => {
                const name = cred.name || `virus-total-${i}`;
                data[name] = response;
              });
            }
          },
        );
        response.send(data);
      } else {
        response.status(404).send("Missing type, search, or credentials");
      }
    });
  },
);
