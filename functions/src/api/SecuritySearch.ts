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
      let promises: Promise<any>[] = [];

      if (type && search && credentials) {
        credentials.forEach(
          (cred: { type: string; name: string; apiKey: string }, i: number) => {
            if (cred.type == "ip-info") {
              promises.push(getIpInfoResponse(search, cred.apiKey, cred.name));
            } else if (cred.type == "virus-total") {
              promises.push(
                getVirusTotalResponse(search, cred.apiKey, cred.name),
              );
            }
          },
        );
      } else {
        response.status(404).send("Missing type, search, or credentials");
      }

      Promise.allSettled(promises).then((data) => {
        let resp: any = {};
        data.forEach((r: any, i: any) => {
          resp[r.value.name] = r.value.data;
        });
        response.status(200).send(resp);
      });
    });
  },
);
