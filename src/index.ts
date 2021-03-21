import {google, Auth} from 'googleapis';
import * as core from '@actions/core';

export async function main() {
  try {
    // The options returned from `getInput` appear to always be strings.
    const options = {
      from: core.getInput('subject'),
      to: core.getInput('to'),
      cc: core.getInput('cc'),
      bcc: core.getInput('bcc'),
      subject: core.getInput('subject'),
      body: core.getInput('body'),
      serviceAccountJson: core.getInput('serviceAccountJson'),
      refreshToken: core.getInput('refreshToken'),
      accessToken: core.getInput('accessToken'),
    };

    let serviceAccountJson: Auth.JWTInput;
    try {
      serviceAccountJson = JSON.parse(options.serviceAccountJson);
    } catch {
      // assume we got base64 encoded content
      serviceAccountJson = JSON.parse(
        Buffer.from(options.serviceAccountJson, 'base64').toString('ascii')
      );
    }
    serviceAccountJson.refresh_token = options.refreshToken;
    const auth = google.auth.fromJSON(serviceAccountJson);
    const gmail = google.gmail({
      version: 'v1',
      auth,
    });

    const message = `
      From: ${options.from}
      To: ${options.to}
      Content-Type: text/html; charset=utf-8
      MIME-Version: 1.0
      Subject: ${options.subject}

      ${options.body}
    `;

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log(res.data);

    //core.error(`[${link.status.toString()}] ${link.url}`);
    //core.info(`[${link.status.toString()}] ${link.url}`);
    //core.debug(`[SKP] ${link.url}`);
    //core.setFailed(failureOutput);
    //core.setOutput('results', result);
  } catch (err) {
    core.setFailed(`Gmail Notifier exception: \n${err.message}\n${err.stack}`);
  }
}

if (require.main === module) {
  main();
}
