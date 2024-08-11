export const getNewWorkflowRunNotifEmailConfig = (input: {
    userFullName: string | null,
    workflowTitle: string,
    workspaceSlug: string,
    workflowId: string,
    workflowRunId: string,
}) => {

    const subject = `Someone just run your workflow "${input.workflowTitle}" on MindPal!`

    const htmlBody = `<!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }

              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #5A51E6;
                  /* Primary color */
                  color: white !important;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
              }

              h2 {
                  color: #5A51E6;
                  /* Primary color */
              }

              .link {
                  color: #5A51E6 !important;
                  text-decoration: none !important;
                  border-bottom: 1px solid #5A51E6 !important;
              }

              .link:hover {
                  opacity: 0.8;
              }
          </style>
      </head>

      <body>

          <p>Hi${input.userFullName ? (' ' + input.userFullName) : ''},</p>

          <p>Your workflow "${input.workflowTitle}" just had a new run.</p>

          <p>Want to see how it went? Just click below:</p>

          <p>
              <a href="${`https://brain.mindpal.space/${input.workspaceSlug}/workflow/${input.workflowId}/run/${input.workflowRunId}`}" target="_blank" class="button">View workflow run</a>
          </p>

          <p>Cheers,<br>
              Tuan<br>
              Founder @ <a href="https://mindpal.space/" target="_blank" class="link">MindPal</a>
          </p>
          
      </body>

      </html>
    `;

    return ({
        subject,
        htmlBody,
    })
}