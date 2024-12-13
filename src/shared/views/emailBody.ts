export const emailBody = (url: string) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        h1 {
          text-align: center;
        }
        .content {
          margin-top: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4CAF50;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #45a049;
        }
        .disabled-message {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Password Reset</h1>
        <div class="content">
          <p>Dear User,</p>
          <p>We have received a request to reset your password. To proceed with the password reset, please click the link below:</p>
          <p>
            <a class="button" href=${url}>Click Here</a>
          </p>
          <p class="disabled-message">Please note that the link will be disabled in 10 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you!</p>
        </div>
      </div>
    </body>
    </html>
    `;
};
