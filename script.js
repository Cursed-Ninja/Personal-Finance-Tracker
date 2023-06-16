const btn = document.getElementById("submit");
const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("amount");
const transactionType = document.getElementById("transactionType");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const editBtn = document.getElementById("editBtn");
const tableBody = document.getElementById("listItems");
const errorText = document.getElementById("errorText");

const editIcon = `<i class="fa fa-edit"></i>`;
const transactionTypes = `<select id="transactionType"><option value="income">Income</option><option value="expense">Expense</option></select>`;

let balanceValue = 0;
let editing = false;
let tableError = 0;

let rows = {};

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const saveToLocalStorage = () => {
  localStorage.setItem("rows", JSON.stringify(rows));
};

const checkTableError = () => {
  if (tableError > 0) {
    editBtn.disabled = true;
  } else {
    editBtn.disabled = false;
  }
};

const addItemToStore = (id, name, amount, type) => {
  rows[id] = {
    name,
    amount,
    type,
    amountError: false,
    nameError: false,
    toDelete: false,
  };
};

const updateBalance = () => {
  balance.innerHTML = balanceValue;
};

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

const addRow = (id, name, amount, type) => {
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
  newRow.id = id;

  itemTypeSelect.innerHTML = transactionTypes;
  itemTypeSelect.value = type;

  itemAmountInput.type = "text";
  itemAmountInput.value = amount;

  itemNameInput.type = "text";
  itemNameInput.value = name;

  deleteCheckbox.type = "checkbox";
  itemDelete.classList.add("delete");

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

  itemNameInput.classList.add("editable");
  itemAmountInput.classList.add("editable");
  itemTypeSelect.classList.add("editable");
  itemNameInput.toggleAttribute("disabled");
  itemAmountInput.toggleAttribute("disabled");
  itemTypeSelect.toggleAttribute("disabled");

  itemName.appendChild(itemNameInput);
  itemName.appendChild(itemNameError);
  itemAmount.appendChild(itemAmountInput);
  itemAmount.appendChild(itemAmountError);
  itemType.appendChild(itemTypeSelect);
  itemDelete.appendChild(deleteCheckbox);

  newRow.append(itemName, itemAmount, itemType, itemDelete);
  tableBody.appendChild(newRow);

  if (type === "income") {
    balanceValue += amount;
  } else {
    balanceValue -= amount;
  }
  updateBalance();
};

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
  addItemToStore(newRow.id, name, amount, type);
  addRow(id, name, amount, type);
  saveToLocalStorage();
};

const toggleDeleteColumn = () => {
  list.classList.toggle("edit");
};

const toggleEditiableCells = () => {
  const editableCells = document.querySelectorAll(".editable");
  editableCells.forEach((cell) => {
    cell.toggleAttribute("disabled");
  });
};

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

loadFromLocalStorage();
