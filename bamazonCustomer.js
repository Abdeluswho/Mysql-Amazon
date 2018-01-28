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
	SELECTALL();

	setTimeout(promptUser, 2000);
});


//Select all the products to display for the customer
function SELECTALL() {
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

	    		console.log("ID ", id + "Quantity ", quantity);
	});

}






























