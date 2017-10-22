var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";
       /* An aggregation query on the "item" collection to return the
       total number of items in each category.
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

        /* A query on the "item" collection to select only the items
        that should be displayed for a particular page of a given category.
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

        /*  A query that determines the number of items in a category
        and pass the count to the callback function. 
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

        /*  Implement the getItem() method. */

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

        /*  Implement addReview().  */

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
            price: 29.00,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
