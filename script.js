const btn = document.getElementById("submit");
const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("amount");
const transactionType = document.getElementById("transactionType");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const editBtn = document.getElementById("editBtn");
const tableBody = document.getElementById("listItems");

const editIcon = `<i class="fa fa-edit"></i>`;
const transactionTypes = `<select id="transactionType"><option value="income">Income</option><option value="expense">Expense</option></select>`;

let balanceValue = 0;
let editing = false;

const deleteElement = (element) => {};

const modifyElement = (element, edit = false) => {};

const updateBalance = () => {
  balance.innerHTML = balanceValue;
};

const inputValidation = () => {};

const addExpense = () => {
  const name = transactionName.value;
  const amount = Number(transactionAmount.value);
  const type = transactionType.value;
  const newRow = document.createElement("tr");
  const itemName = document.createElement("td");
  const itemAmount = document.createElement("td");
  const itemType = document.createElement("td");
  const deleteCheckbox = document.createElement("input");
  const itemNameInput = document.createElement("input");
  const itemAmountInput = document.createElement("input");
  const itemTypeSelect = document.createElement("select");

  itemTypeSelect.innerHTML = transactionTypes;
  itemTypeSelect.value = type;

  itemAmountInput.type = "number";
  itemAmountInput.value = amount;

  itemNameInput.type = "text";
  itemNameInput.value = name;

  deleteCheckbox.type = "checkbox";
  deleteCheckbox.classList.add("delete");

  deleteCheckbox.addEventListener("click", () => {
    deleteCheckbox.classList.toggle("to-delete");
  });

  itemAmountInput.addEventListener("focus", () => {
    if (itemTypeSelect.value === "income") {
      balanceValue -= Number(itemAmountInput.value);
    } else {
      balanceValue += Number(itemAmountInput.value);
    }
  });

  itemAmountInput.addEventListener("blur", () => {
    if (itemTypeSelect.value === "income") {
      balanceValue += Number(itemAmountInput.value);
    } else {
      balanceValue -= Number(itemAmountInput.value);
    }
    updateBalance();
  });

  itemTypeSelect.addEventListener("change", () => {
    if (itemTypeSelect.value === "income") {
      balanceValue += Number(itemAmountInput.value);
    } else {
      balanceValue -= Number(itemAmountInput.value);
    }
    updateBalance();
  });

  itemNameInput.classList.add("editable");
  itemAmountInput.classList.add("editable");
  itemTypeSelect.classList.add("editable");
  itemNameInput.toggleAttribute("disabled");
  itemAmountInput.toggleAttribute("disabled");
  itemTypeSelect.toggleAttribute("disabled");

  itemName.appendChild(itemNameInput);
  itemAmount.appendChild(itemAmountInput);
  itemType.appendChild(itemTypeSelect);

  newRow.append(itemName, itemAmount, itemType, deleteCheckbox);
  tableBody.appendChild(newRow);

  if (type === "income") {
    balanceValue += amount;
  } else {
    balanceValue -= amount;
  }
  updateBalance();
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
    balanceValue -= Number(row.parentElement.children[1].children[0].value);
    row.parentElement.remove();
  });
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
  }
  toggleDeleteColumn();
  toggleEditiableCells();
  deleteRows();
  editing = !editing;
});
