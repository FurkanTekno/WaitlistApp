const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

// URL for the POST request
const url = 'https://api.disneypinnacle.com/consumer/graphql?JoinWaitlist';

// Create a read stream for the emails.txt file
const emailFileStream = fs.createReadStream('emails.txt');

// Create a readline interface to read the emails line by line
const rl = readline.createInterface({
  input: emailFileStream,
  output: process.stdout,
  terminal: false,
});

// Function to send the POST request for a single email with a delay
function sendPostRequest(email) {
  const requestData = {
    operationName: 'JoinWaitlist',
    variables: {
      input: {
        email: email.trim(), // Trim to remove leading/trailing whitespace
      },
    },
    query:
      'mutation JoinWaitlist($input: JoinWaitlistInput!) {\n  joinWaitlist(input: $input) {\n    waitlistUser {\n      ...WaitlistUserDefault\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment WaitlistUserDefault on WaitlistUser {\n  dapperId\n  email\n  status\n  __typename\n}',
  };

  // Send the POST request
  return axios.post(url, requestData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Process emails one by one with a delay
function processEmails(emails) {
  if (emails.length === 0) {
    console.log('Successfully entered Waitlist');
    return;
  }

  const email = emails.shift(); // Get the next email to process

  sendPostRequest(email)
    .then((response) => {
      console.log(`Waitlist for email "${email}" successful!`);
      const formattedResponse = {
        data: {
          joinWaitlist: response.data.data.joinWaitlist,
        },
      };
     // console.log('Response:');
      //console.log(JSON.stringify(formattedResponse, null, 4)); // Print the formatted response data
      
      // Wait for 5 seconds (5000 milliseconds) before processing the next email
      setTimeout(() => {
        processEmails(emails);
      }, 3000);
    })
    .catch((error) => {
      console.error(`Waitlist for email "${email}" failed:`, error.message);
      
      // Continue processing the next email immediately in case of an error
      processEmails(emails);
    });
}

// Read and process each email from the file
const emails = [];
rl.on('line', (email) => {
  emails.push(email);
});

rl.on('close', () => {
  // Start processing emails after reading them all
  processEmails(emails);
});
