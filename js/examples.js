// BudgetJS examples script
"use strict"; 

function examples() {

	const body = document.querySelector('body');
	// Title for example 1
	const example1 = document.createElement('h5');
	example1.className = "exTitle";
	example1.innerText = "Example 1";
	body.append(example1);

	/* example data loaded manually for examples 1 and 2
	   (note this can be done by the user interactively as well on the web page)*/

	// EXAMPLE 1 Individual Budget
	const i = new Budget("Individual Budget", "inc", "exp");
	i.makeBudget();

	i.addIncomeToTable(i.addData("income", "Rental Income", 2250));
	i.addIncomeToTable(i.addData("income", "Main job", 5000));
	i.addIncomeToTable(i.addData("income", "Photography", 500));
	i.addIncomeToTable(i.addData("income", "Dog Walking", 100));
	i.addExpenseToTable(i.addData("expense", "Food", 300));
	i.addExpenseToTable(i.addData("expense", "Rent", 1800));
	i.addExpenseToTable(i.addData("expense", "Transportation", 200));

	// Title for example 2
	const example2 = document.createElement('h5');
	example2.className = "exTitle";
	example2.innerText = "Example 2";
	body.append(example2);

	// EXAMPLE 2 
	const b = new Budget("Business Budget", "inc1", "exp1");
	b.makeBudget();

	// set off for the purposes of the landing page
	b.data.warning = "off";

	b.addIncomeToTable(b.addData("income", "Sales Revenues", 998000));
	b.addIncomeToTable(b.addData("income", "Interest Revenues", 150000));
	b.addExpenseToTable(b.addData("expense", "Marketing and Advertising", 333000));
	b.addExpenseToTable(b.addData("expense", "Wages", 900000));
	b.addExpenseToTable(b.addData("expense", "Commissions", 50000));

	b.data.warning = "on";

	// Title for example 3
	const example3 = document.createElement('h5');
	example3.className = "exTitle";
	example3.innerText = "Example 3";
	body.append(example3);

	// EXAMPLE 3
	const e = new Budget("August Budget", "inc2", "exp2");
	e.makeBudget();
}

examples();



