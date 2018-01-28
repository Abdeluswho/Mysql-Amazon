// Pull in required dependencies
let inquirer = require('inquirer');
let mysql = require('mysql');

// Define the MySQL connection parameters
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '',
    database: 'bamazon'
});


connection.connect(function (err) {
	// body...
	if (err) throw err;
	console.log('connect as ID: ', connection.threadId);
	displayInventory();

	setTimeout(promptUser, 2000);
});


//Select all the products to display for the customer
function displayInventory() {
	// body...
	connection.query("SELECT * from products ", function(err,res){
		if (err) throw err;

		 console.log('\nExisting Inventory: ');
         console.log('------------------------------------------------------------------------------------\n');

        var strOut = '';
        for (var i = 0; i < res.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + res[i].item_id + '  || ';
            strOut += 'Product Name: ' + res[i].product_name + '  || ';
            strOut += 'Department: ' + res[i].department_name + '  ||  ';
            strOut += 'Price: $' + res[i].price_usd + '\n';

            console.log(strOut);
        }

        console.log("--------------------------------------------------------------------------------------\n");
		
		// console.log("result", res);
	})
}

function checkInput(value) {
    var sign = Math.sign(value);

    if (sign === 1) {
        return true;
    } else {
        return 'Please enter a positive number.';
    }
}



function promptUser() {
	// body...
		inquirer.prompt(
		[
			{
				name: "productID",
				message: "Please provide the ID of the product that you would like to buy?"
			},
			{
				name: "quantity",
				message: "How many would you like to buy, today?",
				validate: checkInput,
				filter: Number
			}
		]).then(input => {

			let id = input.productID;
			let quantity = input.quantity;

	      
	               // Query db to confirm that the given item ID exists in the desired quantity
        var queryInv = 'SELECT * FROM products WHERE ?';

        connection.query(queryInv, {item_id: id}, function(err, data) {
            if (err) throw err;

            // If the user has selected an invalid item ID, data array will be empty

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                displayInventory();

            } else {
                var productData = data[0];

                // console.log('productData = ' + JSON.stringify(productData));
                // console.log('productData.stock_quantity = ' + productData.stock_quantity);

                // If the quantity requested by the user is in stock
                if (quantity <= productData.stock_quantity) {
                    console.log('Congratulations, the product you requested is in stock! Placing order!');

                    // Construct the updating query string
                    var updateQueryInv = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + id;
                    // console.log('updateQueryStr = ' + updateQueryStr);

                    // Update the inventory
                    connection.query(updateQueryInv, function(err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price_usd * quantity);
                        console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");

                        // End the database connection
                        connection.end();
                    })
                } else {
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as it is.');
                    console.log('Please modify your order.');
                    console.log("\n---------------------------------------------------------------------\n");

                    promptUser();
                }
            }
        
		});
     })
}






























