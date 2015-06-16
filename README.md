# Adhoc-Arranger

Arrange an ad hoc contact moment between two people

The Ad Hoc Arranger demonstrates the possibilities when combining the API’s of Ask CS and Sense OS, enabling a "real-time society".


## Running Locally

Make sure you have Java and Maven installed.  Also, install the [Heroku Toolbelt](https://toolbelt.heroku.com/).

```sh
$ mvn install
$ foreman start web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).


## Deploying to Heroku

```sh
$ git push heroku master
$ heroku open
```

The app is deployed at: https://adhoc-arranger.herokuapp.com/


## Install and bundle webapp

The web application is located in the folder `./webapp`. 

To install or update the npm dependencies of the webapp, run

```sh
$ cd ./webapp
$ npm install
```

To bundle the web application:

```sh
$ npm run bundle
```

To run the development version of the web application, start the web server,
then open the following url in your browser:

[http://localhost:5000/dev.html](http://localhost:5000/dev.html).

To run the production version:

[http://localhost:5000](http://localhost:5000).



## Documentation

For more information about using Java on Heroku, see these Dev Center articles:

- [Java on Heroku](https://devcenter.heroku.com/categories/java)

