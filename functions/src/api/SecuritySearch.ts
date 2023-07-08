/* eslint-disable */
import { onRequest } from "firebase-functions/v2/https";
import { getIpInfoResponse } from "../helpers/IpInfo";
import { getVirusTotalResponse } from "../helpers/VirusTotal";
import { getRunZeroResponse } from "../helpers/RunZero";

const cors = require("cors")({ origin: true });

export const search = onRequest((request: any, response: any) => {
  cors(request, response, async () => {
    const type = request.body.params.type;
    const search = request.body.params.search;
    const credentials = request.body.data.credentials;

    let promises: Promise<any>[] = [];

    if (type && search && credentials) {
      credentials.forEach(
        (cred: { type: string; name: string; apiKey: string }, i: number) => {
          if (cred.type == "ip-info") {
            promises.push(
              getIpInfoResponse(search, cred.apiKey, cred.name, type),
            );
          } else if (cred.type == "virus-total") {
            promises.push(
              getVirusTotalResponse(search, cred.apiKey, cred.name),
            );
          } else if (cred.type == "runzero") {
            promises.push(
              getRunZeroResponse(search, cred.apiKey, cred.name, type),
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
});
