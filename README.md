## BudgetJS
### Landing Page: https://budget-tracker-js.netlify.app

#### Getting Started

To use the BudgetJS library, include the budget.js script and the budget.css stylesheet in the webpage.
`````
<link rel="stylesheet" type="text/css" href="budget.css">
<script defer type="text/javascript" src='budget.js'></script>
`````
Easily create a new budget system with all of the features by creating a Budget() instance and calling makeBudget().
`````
const budgetInstance = new Budget("Budget name", "incomeID", "expenseID");
budgetInstance.makeBudget();
`````
#### Link to documentation: https://budget-tracker-js.netlify.app/documentation.html