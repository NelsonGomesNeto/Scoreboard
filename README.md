### Front-End: Angular 8
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

### Deployed using Heroku
* Check the Heroku log: `
  heroku logs --app huxley-scoreboard --tail
`