/* BudgetJS Library */
"use strict";

(function (global) {
  // Budget object
  function Budget(name, incID, expID) {
    this.name = name;
    this.incID = incID;
    this.expID = expID;
    this.data = {
      balance: parseFloat(0),
      ratio: 0.5,
      warning: "on",
      items: {
        income: [],
        expense: [],
      },
    };
  }

  // Income object
  function Income(id, name, value) {
    this.id = id;
    this.name = name;
    this.value = value;
  }

  // Expense object
  function Expense(id, name, value) {
    this.id = id;
    this.name = name;
    this.value = value;
  }

  Budget.prototype = {
    // Add a new income or expense object to this.data
    addData: function (type, name, value) {
      // create income or expense object depending on type
      let newObj;
      // create a unique id
      let id = 1000;
      if (type === "income") {
        if (this.data.items["income"].length > 0) {
          id += this.data.items["income"].length;
        }
        newObj = new Income(id, name, value);
        // update budget balance
        this.data.balance += parseFloat(value);
        this.updateBalance();
      } else {
        id = 2000;
        if (this.data.items["expense"].length > 0) {
          id += this.data.items["expense"].length;
        }
        newObj = new Expense(id, name, value);
        this.data.balance -= parseFloat(value);
        this.updateBalance();
      }
      this.data.items[type].push(newObj);
      return newObj;
    },

    /* Gets the information from the event to append a new income object to the 
		/  income table. */
    addNewIncome: function (e) {
      if (e.target && e.target.id === this.incID) {
        // Get the name and amount entered
        let incomeName = document.querySelector("#" + this.incID + "n");
        let incomeAmt = document.querySelector("#" + this.incID + "a");
        let value = parseFloat(incomeAmt.value);
        // check that an integer or float is entered
        if (
          ((!isNaN(value) && value.toString().indexOf(".") != -1) ||
            value % 1 === 0) &&
          value > 0
        ) {
          this.addIncomeToTable(
            this.addData("income", incomeName.value, incomeAmt.value)
          );
        } else {
          // invalid input
          if (this.data.warning === "on") {
            this.inputWarning("Please enter a number greater than 0.");
          }
        }
        // clear textfields
        incomeName.value = "";
        incomeAmt.value = "";
      }
    },

    /* Gets the information from the event to append a new expense object to the 
		/  expense table. */
    addNewExpense: function (e) {
      if (e.target && e.target.id === this.expID) {
        let expenseName = document.querySelector("#" + this.expID + "n");
        let expenseAmt = document.querySelector("#" + this.expID + "a");
        let value = parseFloat(expenseAmt.value);
        // check that an integer or float is added
        if (
          ((!isNaN(value) && value.toString().indexOf(".") != -1) ||
            value % 1 === 0) &&
          value > 0
        ) {
          this.addExpenseToTable(
            this.addData("expense", expenseName.value, expenseAmt.value)
          );
        } else {
          // invalid input
          if (this.data.warning === "on") {
            this.inputWarning("Please enter a number greater than 0.");
          }
        }
        // clear textfields
        expenseName.value = "";
        expenseAmt.value = "";
      }
    },

    /* Searches for the correct id of income object to be removed corresponding to
		   the button clicked. */
    removeIncome: function (e) {
      let i;
      if (e.target) {
        // ensures the row to be deleted exists and looks for corresponding id
        const row = document.getElementById(e.target.id.toString());
        for (i = 0; i < this.data.items["income"].length; i++) {
          if (
            row &&
            e.target.id ===
              (this.incID + this.data.items["income"][i].id).toString()
          ) {
            const id = this.data.items["income"][i].id;
            const value = this.data.items["income"][i].value;
            this.data.balance -= parseFloat(value);
            this.data.items["income"].splice(i, 1);
            this.updateBalance();
            this.removeIncomeFromTable(id);
            return;
          }
        }
      }
    },

    /* Searches for the correct id of expense object to be removed corresponding to
		   the button clicked. */
    removeExpense: function (e) {
      let i;
      if (e.target) {
        // ensures the row to be deleted exists and looks for corresponding id
        const row = document.getElementById(e.target.id.toString());
        for (i = 0; i < this.data.items["expense"].length; i++) {
          if (
            row &&
            e.target.id ===
              (this.expID + this.data.items["expense"][i].id).toString()
          ) {
            const id = this.data.items["expense"][i].id;
            const value = this.data.items["expense"][i].value;
            this.data.balance += parseFloat(value);
            this.data.items["expense"].splice(i, 1);
            this.updateBalance();
            this.removeExpenseFromTable(id);
            return;
          }
        }
      }
    },

    // Gets all the necessary information to generate a report of this budget
    generateReport: function (e) {
      if (e.target && e.target.id === this.incID + this.expID + "gr") {
        // calculate report metrics
        let i;
        let totalIncome = 0;
        let totalExpenses = 0;
        for (i = 0; i < this.data.items["income"].length; i++) {
          totalIncome += parseFloat(this.data.items["income"][i].value);
        }
        for (i = 0; i < this.data.items["expense"].length; i++) {
          totalExpenses += parseFloat(this.data.items["expense"][i].value);
        }
        const ratio = ((totalExpenses / totalIncome) * 100).toFixed(2);

        // format the text for the report
        const text =
          "<b>" +
          this.name +
          "</b>" +
          "<br>" +
          "Available Budget: " +
          this.data.balance.toString() +
          "<br>" +
          "Total Income: " +
          totalIncome.toString() +
          "<br>" +
          "Total Expense: " +
          totalExpenses.toString() +
          " (" +
          ratio.toString() +
          "% of income)" +
          "<br>";
        this.createReport(text);
      }
    },

    // Updates the expense to income ratio
    updateRatio: function (newRatio) {
      this.data.ratio = newRatio;
    },

    /* DOM Functions */

    /* Creates a div to hold 3 sub-divs making up the budget system:
		generate report div, income table div and expense table div */
    makeBudget: function () {
      const budgetDiv = document.createElement("div");
      budgetDiv.className = "budgetDiv";

      // append an the generate report div and income & expense tables
      budgetDiv.appendChild(this.addGenerateReport());
      budgetDiv.appendChild(this.makeIncomeTable());
      budgetDiv.appendChild(this.makeExpenseTable());

      const body = document.querySelector("body");
      body.append(budgetDiv);
    },

    // Creates an empty income table and returns the div containing it.
    makeIncomeTable: function () {
      const income = document.createElement("div");
      income.id = "incomeDiv";
      const incomeTable = document.createElement("table");
      incomeTable.innerHTML = `<tbody id=${this.incID}><tr>
									 <th class="incHeader">Income</th></tr></tbody>`;
      income.appendChild(incomeTable);

      // button to add income or add expense
      const addIncomeForm = document.createElement("Form");
      addIncomeForm.innerHTML = `<input id=${this.incID}n type="text" placeholder="Income">
									   <input id=${this.incID}a type="text" placeholder="Amount">
									   <input class="incButton" id=${this.incID} type="button" 
									   value="Add Income (+)">`;
      const addIncomeRow = document.createElement("tr");
      addIncomeForm.className = "addForm";
      const addIncomeCell = document.createElement("td");

      addIncomeCell.appendChild(addIncomeForm);
      addIncomeRow.appendChild(addIncomeCell);
      incomeTable.appendChild(addIncomeRow);

      // event listener for add new income button
      document.addEventListener("click", this.addNewIncome.bind(this), false);
      return income;
    },

    // Creates an empty expense table and returns the div containing it.
    makeExpenseTable: function () {
      const expense = document.createElement("div");
      expense.id = "expenseDiv";
      const expenseTable = document.createElement("table");
      expenseTable.innerHTML = `<tbody id=${this.expID}><tr>
									  <th class="expHeader">Expenses</th></tr></tbody>`;
      expense.appendChild(expenseTable);

      const addExpenseForm = document.createElement("Form");
      addExpenseForm.innerHTML = `<input id=${this.expID}n type="text" placeholder="Expense">
										<input id=${this.expID}a type="text" placeholder="Amount">
										<input class="expButton" id=${this.expID} type="button" 
										value="Add Expense (-)">`;
      const addExpenseRow = document.createElement("tr");
      addExpenseForm.className = "addForm";
      const addExpenseCell = document.createElement("td");
      addExpenseCell.appendChild(addExpenseForm);
      addExpenseRow.appendChild(addExpenseCell);
      expenseTable.appendChild(addExpenseRow);

      document.addEventListener("click", this.addNewExpense.bind(this), false);
      return expense;
    },

    /* Returns the generate report div containing budget balance display and 
		   generate report button. */
    addGenerateReport: function () {
      // text display of budget balance
      const genReportDiv = document.createElement("div");
      genReportDiv.className = "genReportDiv";
      const balance = document.createElement("p");
      balance.id = this.incID + this.expID;
      balance.className = "balance";
      balance.innerText = `${this.name}: $${this.data.balance}`;

      // generate report button
      const genReport = document.createElement("Button");
      genReport.id = this.incID + this.expID + "gr";
      genReport.innerText = "Generate Report";
      genReport.className = "grButton";

      genReportDiv.appendChild(balance);
      genReportDiv.appendChild(genReport);

      // event listener for generate report button
      document.addEventListener("click", this.generateReport.bind(this), false);
      return genReportDiv;
    },

    // Updates budget balance, sending a warning messsage when appropriate.
    updateBalance: function () {
      const newbalance = document.getElementById(this.incID + this.expID);
      newbalance.innerText = this.name + ": $" + this.data.balance.toString();

      let totalIncome = 0;
      for (let i = 0; i < this.data.items["income"].length; i++) {
        totalIncome += parseFloat(this.data.items["income"][i].value);
      }

      // expenses > income
      if (totalIncome - this.data.balance > totalIncome) {
        document.getElementById(this.incID + this.expID).style.color =
          "#c41e0c";
        if (this.data.warning === "on") {
          this.inputWarning("Expenses are now greater than income.");
        }
      }

      // expense/income within the specified ratio
      else if (
        (totalIncome - this.data.balance) / totalIncome <
        this.data.ratio
      ) {
        document.getElementById(this.incID + this.expID).style.color = "green";
      }

      // expense/income greater than ratio but less than 1
      else if (
        (totalIncome - this.data.balance) / totalIncome >=
        this.data.ratio
      ) {
        document.getElementById(this.incID + this.expID).style.color =
          "#FFB61E";
        if (this.data.warning === "on") {
          this.inputWarning(
            "Expense to income ratio is greater than the specified limit of " +
              this.data.ratio.toString()
          );
        }
      }
    },

    // Add income object to table
    addIncomeToTable: function (incObj) {
      const tableID = this.incID;
      const table = document.querySelector("#" + tableID);
      const newIncomeRow = document.createElement("tr");
      newIncomeRow.id = this.incID + incObj.id.toString();
      newIncomeRow.innerHTML = `<td><button class="del" id=${
        this.incID + incObj.id.toString()
      }>x</button>
									  <p class="item">${incObj.name}: $${incObj.value}</p></td>`;
      table.appendChild(newIncomeRow);

      // event listener for remove income button
      document.addEventListener("click", this.removeIncome.bind(this), false);
    },

    // Add expense object to table
    addExpenseToTable: function (expObj) {
      const tableID = this.expID;
      const table = document.querySelector("#" + tableID);
      const newExpenseRow = document.createElement("tr");
      newExpenseRow.id = this.expID + expObj.id.toString();
      newExpenseRow.innerHTML = `<td><button class="del" id=${
        this.expID + expObj.id.toString()
      }>x</button>
									   <p class="item">${expObj.name}: $${expObj.value}</p></td>`;
      table.appendChild(newExpenseRow);

      // event listener for remove expense button
      document.addEventListener("click", this.removeExpense.bind(this), false);
    },

    // Removes the income row specified from the table
    removeIncomeFromTable: function (id) {
      const row = document.getElementById(this.incID + id.toString());
      if (row) {
        row.parentNode.removeChild(row);
      }
    },

    // Removes the expense row specified from the table
    removeExpenseFromTable: function (id) {
      const row = document.getElementById(this.expID + id.toString());
      if (row) {
        row.parentNode.removeChild(row);
      }
    },

    // Creates a closeable popup warning message
    inputWarning: function (text) {
      const inputWarning = document.createElement("div");
      inputWarning.className = "alert";
      inputWarning.innerHTML = `<span class="closebtn" onclick="this.parentElement.style.display='none';">
									&times;</span> ${text} <button id=${this.incID}show class="hideWarning">
									Don't show again</button>`;
      const body = document.querySelector("body");
      // put the message at the top of the page
      body.prepend(inputWarning);

      // event listener for hide warning button
      document.addEventListener("click", this.hideWarning.bind(this), false);
    },

    // Creates an overlay of the budget report
    createReport: function (text) {
      const report = document.createElement("div");
      report.className = "report";
      report.innerHTML = `<span class="closeReport" 
								onclick="this.parentElement.style.display='none';">&times;</span> 
  								<p class="reportText">${text}</p>`;
      const body = document.querySelector("body");
      body.prepend(report);
    },

    // Hides future warnings
    hideWarning: function (e) {
      if (e.target && e.target.id === this.incID + "show") {
        this.data.warning = "off";
        document.getElementById(
          this.incID + "show"
        ).parentElement.style.display = "none";
      }
    },
  };
  global.Budget = global.Budget || Budget;
})(window);
