const express = require('express');
const routes = require('./routes/index');

require('dotenv').config({ path: __dirname + '/../variables.env' });

const app = express();
app.set('port', 7777);

app.use('/', routes);

const server = app.listen(app.get('port'), () => {
    console.log(`Express running on port 7777 click here to view: http://localhost:7777`)
});
