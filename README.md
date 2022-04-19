# Dynatrace-Spring4Shell-JavaScript-TypeScript-Export
A TypeScript script that gets the spring 4 shell vulnerable processes, determines if the java and tomcat are used, and identifies Java versions 9+

**Disclaimer - This application is not officially supported by Dynatrace. This is a custom program written to help identify vulnerable processes. See LICENSE for details.**


## Pre-Requisites
Node 14 or greater

## How to Run

1. First git clone this repo
2. In your terminal install all the npm dependencies by running:
```bash
npm install
```

3. Using the variables.env.sample file, edit the filename to remove the .sample so it is now called 'variables.env' then add the appropriate values into the variables.
```bash
# Dynatrace Environment URL that the application will run against.
URL="https://abc1234.live.dynatrace.com"
# Dynatrace REST API token
TOKEN="MySecretToken"
```

4. Start the program, this will start the program on port 7777
```bash
# Build and launch the application on port 7777
npm start
```
