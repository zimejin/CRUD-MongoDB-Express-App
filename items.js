var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";

        /*
        * TODO-lab1A
        *
        * LAB #1A: Implement the getCategories() method.
        *
        * Write an aggregation query on the "item" collection to return the
        * total number of items in each category. The documents in the array
        * output by your aggregation should contain fields for "_id" and "num".
        *
        * HINT: Test your mongodb query in the shell first before implementing
        * it in JavaScript.
        *
        * In addition to the categories created by your aggregation query,
        * include a document for category "All" in the array of categories
        * passed to the callback. The "All" category should contain the total
        * number of items across all categories as its value for "num". 
        *
        * Ensure categories are organized in alphabetical order before passing
        * to the callback.
        *
        */

        // Run a MongoDB query to group the category and provide a
        // sum of the category.
        var categories = [];
        database.collection("item").aggregate( [ {
          $group: {
            _id: "$category",
            num: { $sum: 1 }
          }},
          {$sort: {_id: 1 }}]).toArray(function(err, data){
            categories.push(...data);
            var sum = categories.reduce(function(acc, val){
              return acc + val["num"]
            }, 0);

        // Create a variable to store the value of Sum and _id
            var allcategory = {
              _id: "All",
              num: sum
            }
        // Push to front of categories array and callback()
            categories.unshift(allcategory)
            callback(categories);
          })
    }


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab1B
         *
         * LAB #1B: Implement the getItems() method.
         *
         * Create a query on the "item" collection to select only the items
         * that should be displayed for a particular page of a given category.
         * The category is passed as a parameter to getItems().
         *
         * Sort items in ascending order based on the _id field. You must use
         * this sort to answer the final project questions correctly.
         *
         * Note: Since "All" is not listed as the category for any items,
         * you will need to query the "item" collection differently for "All"
         * than you do for other categories.
         *
         */

         // Query the Database for the particular Category
         // Using the Conditional Ternary Operator
         var query = category== 'All' ? {} : {category: category}
         var cursor = database.collection("item").find(query);
         cursor.sort({_id: 1});
         cursor.limit(itemsPerPage);
         cursor.skip(itemsPerPage * page )
         // Convert Our Query Results to Array.
         cursor.toArray(function(err, data) {
         // Declare pageItems As an Empty Array for Our Callback
           var pageItems = [];
           pageItems.push(...data)
        // Return the Callback Function
           callback(pageItems)
         })
        }


    this.getNumItems = function(category, callback) {
        "use strict";

        /*
         * TODO-lab1C:
         *
         * LAB #1C: Implement the getNumItems method()
         *
         * Write a query that determines the number of items in a category
         * and pass the count to the callback function. 
         *
         */

        // Get the Query for Category From DB. Using Ternary Operator
        var query = category== 'All' ? {} : {category: category}
         var cursor = database.collection("item").find(query);
         cursor.toArray(function(err, data){
           // Convert the Cursor Value to Array to Findout the Length
           var numItems = data.length
           // callback the numItems
           callback(numItems)
         })
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab2A
         *
         * LAB #2A: Implement searchItems()
         *
         * Using the value of the query parameter passed to searchItems(),
         * perform a text search against the "item" collection.
         *
         * Sort the results in ascending order based on the _id field.
         *
         * Select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage
         * matching the query should be displayed.
         *
         * searchItems() depends on a text index. Before implementing
         * this method, create a SINGLE text index on title, slogan, and
         * description. You should simply do this in the mongo shell.
         *
         */

         // Text Search on MongoDB for the Variable Value of Query
         var cursor = database.collection("item").find({
            	 $text: {
            		  $search: query
            	  }
             });
             // Convert our results to Array Values and Push to Items
            cursor.toArray(function(err, data) {
            	var items = [];
            	items.push(...data);
            	callback(items);
            })
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this
        * method, count the number of items in the "item" collection matching
        * a text search. Pass the count to the callback function.
        */

        // Get the Text Search Results from MongoDB and Convert to Array
        var cursor = database.collection("item").find({
          $text:{
            $search: query
          }});
        cursor.toArray(function(err, data){
          numItems = data.length;
          // Callback the Value of the Array.length
          callback(numItems);
        })
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "item" collection by
         * _id and pass the matching item to the callback function.
         *
         */

         var cursor = database.collection("item").find({
	        _id: itemId
        });
          cursor.toArray(function(err, item) {
	        callback(item[0]);
        })
      }

        this.getRelatedItems = function(callback) {
	      "use strict";
	      this.db.collection("item").find({}).limit(4).toArray(function(err, relatedItems) {
		    assert.equal(null, err);
		    callback(relatedItems);
	    });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        database.collection("item").update({ _id:itemId }, {$push: {reviews:reviewDoc}});
        var cursor = database.collection("item").find({_id:itemId},{reviews:{$elemMatch:{}}})
        cursor.toArray(function(error, data){
          var doc = [];
          doc.push(...data)
          callback(doc)
        })
    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
