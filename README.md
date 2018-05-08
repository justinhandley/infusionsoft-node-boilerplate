# Infusionsoft Node Boilerplate

This is an opinionated setup of an Infusionsoft API.  It is specifically built to deploy easily to [Heroku](https://heroku.com) and to use a GraphQL database powered by [Graph.cool](https://graph.cool) and [Apollo](https://www.apollographql.com/).

Because the REST API from Infusionsoft doesn't cover all of the bases (you can't create legacy text based companies, you can't easily create contact links), we've included configuration of both the [REST API](https://developer.infusionsoft.com/docs/rest) and the legacy [XML-RPC API](https://developer.infusionsoft.com/docs/xml-rpc/) into a single package.

You can easily modify this to deploy elsewhere (we've done it to Digital Ocean, and it could just as easily go to AWS or Google Cloud).  You could also modify it to use whatever database you want, or even a flatfile (we've done that too).

The key thing with the database is simply storing the current Infusionsoft keys.  We use Graph.cool as it gives us a nice easy starting point for a back-end for web and mobile apps, and if you only ever use it to store your Infusionsoft auth information it is free.

There are a couple of 'helper' functions, and more are welcome if you want to submit a pull request.  We use Express to generate a router and API endpoints so you can easily set up webhooks to process your data.  Have fun!

### Setting Up the Graph.Cool Database

If you aren't running Node, you probably shouldn't be doing this.  But, you'll need to [install Node](https://nodejs.org/en/download/) if you are feeling adventurous.  

The first step is to set up a database to store your credentials. You can also use this DB to build entire apps on, or to simply store other information you need to process your tasks, but you'll have to do that on your own.

For complete instructions on getting started with Graph.Cool, see the [official page](https://www.graph.cool/docs/quickstart/)

Otherwise, here is the quick and dirty.

In a terminal, go to the folder you want to store your development files in.  Install the global Graphcool CLI client.

```sh
npm install -g graphcool
```

Then, create a development app.

```sh
graphcool init
```

In that folder, replace the contents of the `types.graphql` and `graphcool.yml` files with the ones in the `graphcool` folder of this repository.

Deploy your service.

```sh
graphcool deploy
```

Choose a region to deploy to and hit enter.

For the next two questions, just hit enter to use defaults or give names if you want.

Graph.cool will open in a new tab if you aren't already a user, go ahead and create an account.

From the terminal, you should have been given a Simple API URL.  Save that.

Log in to the console, and go into the project you just created in the Graph.cool console.

Go to Data > Infusionsoft and then put anything in the Access Token field and hit enter.

This will create a new record.  You need to copy that record ID.

In the terminal again, do

```sh
graphcool root-token nodeAPI
```

This will return a very long value, copy that.

### Heroku

Log in to [Heroku](https://heroku.com) or create a new account if you don't have one.

Create a new app from the dropdown "New" on the top right of Heroku's dashboard screen. Give your app a name and select its servers' location.

Create a new Git repository for this project, and push it to Github.  You can then choose to deploy your Heroku app from GIT.

Under settings, copy the URL of the site you have deployed.

### Infusionsoft

I'm not going to help here - if you are trying to set up an API development tool you need to know how to find your API credentials.

The Infusionsoft API for the app for XML-RPC uses the app name and API key from within the app.  This is due to one of the plugins we use to connect, however, we are working on modifying that plugin to also accept OAUTH Tokens.

For the REST API you need your developer key and secret.

Once you have all of this, go ahead and rename `.env.example` to `.env` fill in the .env file in this project, and also add each of the items in the `.env`

### Getting Up and Running

Once you have her graph.cool database up and your env variables configured and your app live on Heroku, go to http://sitename.herokuapp.com/infusion/auth.  This will take you through the authentication process.  You can then use a service like [EasyCron](http://easycron.com) to ping http://sitename.herokuapp.com/infusion/refresh every 8 or 12 hours to keep your token updated.  We also have a refresh task in bin, so if you want to set up Heroku Scheduler to run 'refresh' once an hour that should keep your token up to date. You can use whatever routes you want - we've set up a demo script in the `process` route that creates a test user.

### Help, Support, etc..

If you find issues with the code, feel free to open an issue or pull request.

I know my instructions for Heroku and Infusionsoft might be a bit lacking - if you can make them better, please submit a pull request.

Otherwise, feel free to contact me directly or through our corporate site at [Pirate & Fox](https://pirateandfox.com).