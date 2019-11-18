const express = require('express');
const bodyParser = require('body-parser');
const graphqlMiddleware = require('express-graphql');
const mongoose = require('mongoose');

const graphiqlSchema = require('./graphql/schema/index');
const graphiqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
const port = 3002;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

app.use('/graphql', graphqlMiddleware({
    schema: graphiqlSchema,
    rootValue: graphiqlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3noon.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useUnifiedTopology: true})
.then(() => {
    app.listen(process.env.PORT || port, () => console.log('listening on localhost:' + port));
})
.catch(err => {
    console.log(err);
});