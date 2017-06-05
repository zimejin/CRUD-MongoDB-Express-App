# Mongo-mart
JavaScript E-commerce Application, Using Node, Express and MongoDB

About

MongoMart is the final lab project in M101JS mongodb for javascript course provided by MongoDB.
MongoMart is an ecommerce site that allows the user to browse for and add MongoDB products to their cart.
There is no user session at the moment, so the user id is hard coded.

Requires

Node.js (with npm)
MongoDB 3.2.x, using the WiredTiger (default for 3.2) storage engine
Knowledge of Commandline interface.
Getting Started

* First Open the commandline and cd to the project directory
* Install required npm depedencies by running npm install
* cd again to data (Mongo-mart/data) directory, while in the directory

- Import the item collection and cart collection by typing
- mongoimport --db mongomart --collection item items.json
- mongoimport --db mongomart --collection cart cart.json

* Then Create a Text Index by running the following code

  db.item.createIndex({title: "text", slogan: "text", description: "text"})

* Finally cd back to root project directory (cd Mongo-mart)

Run the application by typing "node mongomart.js" in the mongomart directory.

And there you have it :-) whew!

![Image](https://github.com/zimejin/Mongo-mart/blob/master/static/img/mmart.jpg?raw=true)

![Image](https://github.com/zimejin/Mongo-mart/blob/master/static/img/pc mart.jpg?raw=true)
