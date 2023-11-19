## Stack

### Front-End: Angular 8
  * AFAIK, there is no need to install dependencies!
  * Angular CLI version: 8.3.29 (required!).
    * `sudo npm install -g @angular/cli@8.3.5`
  * Local build: `
    ng serve
  `
  * Local build open to the public: `
    ng serve --host 0.0.0.0
  `
  * Production build: `
    ng build --prod=true
  `

### Back-End: NodeJS
  * Node version: v10.16.3 (required!).
    * `sudo npm install -g n`
    * `sudo n 10.16.3`
  * Install dependencies: `
    npm install
  `
  * Manually change the production flag on server.js (I will fix this)
  * Build: `
    node server.js
  `

### Database: PostgreSQL
  * Running locally will store on a single json file
    * Just because I'm too lazy to setup everything here tehe
  * Running on production will store stuff on PostgreSQL

## Deploy

### Oracle cloud

Oracle cloud has a great freemium that is more than enough for this.

#### Open ports
1. [Enable internet access to your VM](https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/node-on-ol/01oci-ol-node-summary.htm#add-ingress-rules).
1. Open a port in the VM: `sudo firewall-cmd --zone=public --permanent --add-port=4200/tcp`

### Heroku
* Check the Heroku log: `
  heroku logs --app huxley-scoreboard --tail
`