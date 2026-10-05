import { handleEmailRequest } from "./index";

type EmailWorkerEnv = Parameters<typeof handleEmailRequest>[1];
const PREVIEW_RECIPIENT = "dominicanene@gmail.com";

export default {
  /**
   * Description: Sends dev form messages to Jide without changing the production Worker.
   * Inputs: request follows the private /send contract; env binds Jide's restricted inbox.
   * Output: The existing handler's JSON response; the real binding never receives the owner's address.
   * Examples: preview-config.test.ts verifies that caller-supplied recipients cannot override Jide's inbox.
   */
  fetch(request: Request, env: EmailWorkerEnv): Promise<Response> {
    return handleEmailRequest(request, {
      CONTACT_INBOX: {
        send: (message) => env.CONTACT_INBOX.send({ ...message, to: PREVIEW_RECIPIENT }),
      },
    });
  },
};
