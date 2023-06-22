// Global variables for DOM elements
const btn = document.getElementById("submit");
const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("amount");
const transactionType = document.getElementById("transactionType");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const editBtn = document.getElementById("editBtn");
const tableBody = document.getElementById("listItems");
const errorText = document.getElementById("errorText");

// Global variables for HTML elements
const editIcon = `<i class="fa fa-edit"></i>`;
const transactionTypes = `<select id="transactionType"><option value="income">Income</option><option value="expense">Expense</option></select>`;

// Global variables
let balanceValue = 0;
let editing = false;
let tableError = 0;

// Global state
let rows = {};

/**
 * Function to generate a random uuid
 * @param: none
 * @returns: string
 */
const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Function to save the current state to local storage
 * @param: none
 * @returns: none
 */
const saveToLocalStorage = () => {
  localStorage.setItem("rows", JSON.stringify(rows));
};

/**
 * Function to check if there are any errors in the expenses table
 * @param: none
 * @returns: none
 */
const checkTableError = () => {
  if (tableError > 0) {
    editBtn.disabled = true;
  } else {
    editBtn.disabled = false;
  }
};

/**
 * Function to add an item to the state
 * @param: id: string, name: string, amount: number, type: string
 * @returns: none
 */
const addItemToGlobalState = (id, name, amount, type) => {
  rows[id] = {
    name,
    amount,
    type,
    amountError: false,
    nameError: false,
    toDelete: false,
  };
};

/**
 * Function to update the balance
 * @param: none
 * @returns: none
 */
const updateBalance = () => {
  balance.innerHTML = balanceValue;
};

/**
 * Function to validate the input fields
 * @param: value: string, type: string
 * @returns: boolean
 */
const inputValidation = (value, type) => {
  if (type === "name" && value === "") {
    return false;
  } else if (
    type === "amount" &&
    (value === "" || value <= 0 || isNaN(value))
  ) {
    return false;
  }
  return true;
};

/**
 * Function to add a row to the expenses table. Creates dom elements and adds event listeners
 * @param: id: string, name: string, amount: number, type: string
 * @returns: none
 * @side-effects: updates the balance
 */
const addRow = (id, name, amount, type) => {
  // Create DOM elements
  const newRow = document.createElement("tr");
  const itemName = document.createElement("td");
  const itemAmount = document.createElement("td");
  const itemType = document.createElement("td");
  const itemDelete = document.createElement("td");
  const deleteCheckbox = document.createElement("input");
  const itemNameInput = document.createElement("input");
  const itemAmountInput = document.createElement("input");
  const itemTypeSelect = document.createElement("select");
  const itemNameError = document.createElement("p");
  const itemAmountError = document.createElement("p");

  // Add classes, attributes and ids
  newRow.id = id;
  itemNameInput.classList.add("editable");
  itemAmountInput.classList.add("editable");
  itemTypeSelect.classList.add("editable");
  itemDelete.classList.add("delete");
  itemNameInput.toggleAttribute("disabled");
  itemAmountInput.toggleAttribute("disabled");
  itemTypeSelect.toggleAttribute("disabled");

  // Set content and values of DOM elements
  itemTypeSelect.innerHTML = transactionTypes;
  itemTypeSelect.value = type;

  itemAmountInput.type = "text";
  itemAmountInput.value = amount;

  itemNameInput.type = "text";
  itemNameInput.value = name;

  deleteCheckbox.type = "checkbox";

  // Add event listeners
  deleteCheckbox.addEventListener("click", () => {
    newRow.classList.toggle("to-delete");
    rows[newRow.id].toDelete = !rows[newRow.id].toDelete;
    if (rows[newRow.id].toDelete) {
      tableError -= rows[newRow.id].amountError + rows[newRow.id].nameError;
    } else {
      tableError += rows[newRow.id].amountError + rows[newRow.id].nameError;
    }
    checkTableError();
  });

  itemNameInput.addEventListener("blur", () => {
    if (!inputValidation(itemNameInput.value, "name")) {
      itemNameError.innerText = "Please enter a valid transaction name";
      if (rows[newRow.id].nameError === false) {
        tableError++;
        rows[newRow.id].nameError = true;
      }
      checkTableError();
      return;
    }
    rows[newRow.id].name = itemNameInput.value;
    if (rows[newRow.id].nameError === true) {
      tableError--;
      rows[newRow.id].nameError = false;
    }
    itemNameError.innerText = "";
    checkTableError();
  });

  itemAmountInput.addEventListener("blur", () => {
    if (!inputValidation(itemAmountInput.value, "amount")) {
      itemAmountError.innerText = "Please enter a valid transaction amount";
      if (rows[newRow.id].amountError === false) {
        tableError++;
        rows[newRow.id].amountError = true;
      }
      checkTableError();
      return;
    }
    const itemType = itemTypeSelect.value;
    const initialValue = rows[newRow.id].amount;
    if (itemType === "income") {
      balanceValue += Number(itemAmountInput.value) - initialValue;
    } else {
      balanceValue -= Number(itemAmountInput.value) - initialValue;
    }
    rows[newRow.id].amount = Number(itemAmountInput.value);
    if (rows[newRow.id].amountError === true) {
      tableError--;
      rows[newRow.id].amountError = false;
    }
    itemAmountError.innerText = "";
    checkTableError();
    updateBalance();
  });

  itemTypeSelect.addEventListener("change", () => {
    if (rows[newRow.id].amountError) {
      return;
    }
    if (itemTypeSelect.value === "income") {
      balanceValue += Number(itemAmountInput.value);
    } else {
      balanceValue -= Number(itemAmountInput.value);
    }
    rows[newRow.id].type = itemTypeSelect.value;
    updateBalance();
  });

  // Append DOM elements
  itemName.appendChild(itemNameInput);
  itemName.appendChild(itemNameError);
  itemAmount.appendChild(itemAmountInput);
  itemAmount.appendChild(itemAmountError);
  itemType.appendChild(itemTypeSelect);
  itemDelete.appendChild(deleteCheckbox);

  newRow.append(itemName, itemAmount, itemType, itemDelete);
  tableBody.appendChild(newRow);

  // Update the balance
  if (type === "income") {
    balanceValue += amount;
  } else {
    balanceValue -= amount;
  }
  updateBalance();
};

/**
 * Function to add an expense to the expenses table and the state
 * @param: none
 * @returns: none
 * @side-effects: updates the balance
 * @side-effects: saves the current state to local storage
 * @side-effects: clears the input fields
 * @side-effects: shows an error message if the input is invalid
 */
const addExpense = () => {
  if (!inputValidation(transactionName.value, "name")) {
    errorText.innerText = "Please enter a valid transaction name";
    return;
  }
  if (!inputValidation(transactionAmount.value, "amount")) {
    errorText.innerText = "Please enter a valid transaction amount";
    return;
  }
  const name = transactionName.value;
  const amount = Number(transactionAmount.value);
  const type = transactionType.value;
  const id = uuid();
  addItemToGlobalState(id, name, amount, type);
  addRow(id, name, amount, type);
  transactionName.value = "";
  transactionAmount.value = "";
  saveToLocalStorage();
};

/**
 * Helper function to toggle the edit class
 * @param: none
 * @returns: none
 */
const toggleDeleteColumn = () => {
  list.classList.toggle("edit");
};

/**
 * Helper function to toggle the disabled attribute of the editable cells
 * @param: none
 * @returns: none
 */
const toggleEditiableCells = () => {
  const editableCells = document.querySelectorAll(".editable");
  editableCells.forEach((cell) => {
    cell.toggleAttribute("disabled");
  });
};

/**
 * Function to delete the rows from expenses table and the state if marked for deletion
 * @param: none
 * @returns: none
 * @side-effects: updates the balance
 */
const deleteRows = () => {
  const toDelete = document.querySelectorAll(".to-delete");
  toDelete.forEach((row) => {
    if (rows[row.id].type === "income") {
      balanceValue -= rows[row.id].amount;
    } else {
      balanceValue += rows[row.id].amount;
    }
    delete rows[row.id];
    row.remove();
  });
  updateBalance();
};

/**
 * Function to load the state from local storage to generate the expenses table and update the state
 * @param: none
 * @returns: none
 * @side-effects: updates the balance
 */
const loadFromLocalStorage = () => {
  rows = JSON.parse(localStorage.getItem("rows"));
  if (rows === null) {
    rows = {};
  } else {
    Object.entries(rows).forEach((arr) => {
      const [id, { name, amount, type }] = arr;
      addRow(id, name, amount, type);
    });
  }
  updateBalance();
};

// Event listeners
btn.addEventListener("click", () => {
  addExpense();
});

editBtn.addEventListener("click", () => {
  if (!editing) {
    editBtn.innerHTML = "Save";
  } else {
    editBtn.innerHTML = editIcon;
    deleteRows();
    saveToLocalStorage();
  }
  toggleDeleteColumn();
  toggleEditiableCells();
  editing = !editing;
});

transactionName.addEventListener("input", () => {
  errorText.innerText = "";
});

transactionAmount.addEventListener("input", () => {
  errorText.innerText = "";
});

// Initial function calls
loadFromLocalStorage();
