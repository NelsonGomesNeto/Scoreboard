## Stack

### Front-End: Angular 8
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
  * PostgreSQL version: 12.4 (required!)
    * `sudo apt install postgresql-12 postgresql-client-12 pgadmin4`
    * I prefer to configure everything over pgadmin4: `/usr/pgadmin4/bin/setup-web.sh`
      * [Tutorial](https://www.cybrosys.com/blog/how-to-install-pgadmin-in-ubuntu)
  * Running locally will store on a single json file
    * Just because I'm too lazy to setup everything here tehe
  * Running on production will store stuff on PostgreSQL

## Servers

### Oracle cloud

Oracle cloud has a great freemium that is more than enough for this.

#### Open ports
1. [Enable internet access to your VM](https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/node-on-ol/01oci-ol-node-summary.htm#add-ingress-rules).
1. Open a port in the VM: `sudo firewall-cmd --zone=public --permanent --add-port=4200/tcp`

### Heroku
* Check the Heroku log: `
  heroku logs --app huxley-scoreboard --tail
`

## Deploy
1. Create a file `database_url` on the root folder of this repository.
    * It must follow this pattern: `postgres://{username}:{password}@{host}:5432/{database}`.
    * Do not commit this file!
1. Compile the Front-End at `scoreboard` folder: `ng build --prod=true`.
1. Run the Back-End: `node server.js`.
    * The Back-End hosts the compiled Front-End.