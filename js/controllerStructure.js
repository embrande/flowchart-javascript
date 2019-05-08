//create budget controller
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id,
		this.description = description,
		this.value = value,
		this.percentage = -1;
	};

	Expense.prototype = {
		calcPercentage: function(totalIncome){
			if(totalIncome > 0){
				this.percentage = Math.round((this.value / totalIncome) * 100);
			}else{
				this.percentage = -1;
			}
		},
		getPercentage: function(){
			return this.percentage;
		}
	};

	var Income = function(id, description, value){
		this.id = id,
		this.description = description,
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(cur){
			sum = sum + cur.value;
		});

		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, des, val){
			var newItem,
				ID;

			if(data.allItems[type].length > 0){
				// Create new ID
 				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}else{
				ID = 0;
			}
 			
 			// Create new item based on inc or exp
 			if(type === 'exp'){
				newItem = new Expense(ID, des, val);
			}else if(type === 'inc'){
				newItem = new Income(ID, des, val);
			}

			//push into data structure
			data.allItems[type].push(newItem);

			//return the new element for the UI
			return newItem;
		},

		deleteItem: function(type, id){

			var ids = [], index;

			ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}

		},

		calculateBudget: function(){

			// calculate total income and expenses 
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spend
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}
		}, 

		getBudget: function(){
			return{
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		getPercentages: function(){

			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;

		},

		calculatePercentages: function(){

			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});

		},
		
		testing: function(){
			console.log(data);
		}
	};

})();




//create controller for all UI
var UIController = (function(){

	var DOMstrings = {
		inputType: ".add__type",
		input: ".add__value",
		inputDescription: ".add__description",
		submitButton: ".add__btn",
		expenseContainer: ".expenses__list",
		incomeContainer: ".income__list",
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expenseLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		deleteButtonContainer: ".container",
		deleteParentContainer: ".item",
		deleteButton: ".item__delete--btn",
		expensesPercLabel: '.item__percentage'
	};

	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				input: parseFloat(document.querySelector(DOMstrings.input).value),
				description: document.querySelector(DOMstrings.inputDescription).value
			};
		},
		addListItem: function(obj, type){
			var html, newHtml, element;

			if (type === 'inc'){
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
				element = DOMstrings.incomeContainer;
			}else if (type === 'exp'){
				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
				element = DOMstrings.expenseContainer;
			}

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},
		deleteListItem: function(selectorID){

			var selectSelector = document.getElementById(selectorID);

			selectSelector.parentNode.removeChild(selectSelector);

		},
		clearFields: function(){
			var fields, newFields;

			fields = document.querySelectorAll(DOMstrings.input + ", " + DOMstrings.inputDescription);
		
			// on the array prototype call the slice function and call the nodeList. Forcing it to treat it like an array.
			newFields = [].slice.call(fields);

			newFields.forEach(function(current, index, array){
				current.value = "";
			});

			newFields[0].focus();
		},
		//pass object where all display budget is stored through
		displayBudget: function(obj){
			// obj will contain budget / total income / total expenses / and percentage
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
			
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMstrings.percentageLabel).textContent = '--';
			}
		},
		displayPercentages: function(percentages){

			// get percentage label nodes
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			var nodeListForEach = function(list, callback){
				for( var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
			};

			nodeListForEach(fields, function(current, index){

				if(percentages[index] > 0){
					current.textContent = percentages[index] + "%";
				}else{
					current.textContent = "---";
				}

			});

		},

		formatNumber: function(num, type){
			// + or - before number
			// exactly 2 decimal points
			// comma separating the thousands
			num = Math.abs(num);
			num = num.toFixed(2);
		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};

})();




//create the controller that controls all the flow
//this connects the two controllers and needs to utelize 
//the variables passed through (budgetCtrl, UICtrl)
//and not the global variable objects
var appController = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function(){
		//dom elements only needed for event listeners
		var DOMstrings = UICtrl.getDOMstrings();
		//on checkbox button push
		document.querySelector(DOMstrings.submitButton).addEventListener('click', ctrAddItem);
		//on keypress is enter
		document.addEventListener('keypress', function(e){
			if(e.keyCode === 13 || e.which === 13){
				ctrAddItem();
			}
		});
		document.querySelector(DOMstrings.deleteButtonContainer).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function(){

		var budget;

		// Calculate budget
		budgetCtrl.calculateBudget();

		// Return the budget
		budget = budgetCtrl.getBudget();

		// Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function(){

		// calculate percentages
		budgetCtrl.calculatePercentages();

		// read percentages from budget controller
		var percentages = budgetCtrl.getPercentages();

		// update UI with percentages
		UICtrl.displayPercentages(percentages);
	};

	var ctrAddItem = function(){

		var input, newItem;

		// Get the field input data
		input = UICtrl.getInput();

		// Only happen if description and input isn't empty
		if(input.description !== "" && !isNaN(input.input) && input.input > 0){

			// Add the item to the budget controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.input);
		
			// Add the iitem to the UI
			UICtrl.addListItem(newItem, input.type);

			// Clear the fields
			UICtrl.clearFields();

			// Calculate and update budget
			updateBudget();

			// calculate and update percentages
			updatePercentages();
		}


	};


	var ctrlDeleteItem = function(event){
		var itemID, splitID, type, id;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemID){
			
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			budgetCtrl.deleteItem(type, ID);

		}

		UICtrl.deleteListItem(itemID);

		// calculate and update budget
		updateBudget();

		// calculate and update percentages
		updatePercentages();

	};

	//public initialization function
	return {
		init: function(){
			// Reset top labels using UICtrl displayBudget method
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}


})(budgetController, UIController);


appController.init();

