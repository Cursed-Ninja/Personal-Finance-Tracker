const btn = document.getElementById("submit");
const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("amount");
const transactionType = document.getElementById("transactionType");
const list = document.getElementById("list");
const balance = document.getElementById("balance");

let balanceValue = 0;

const deleteElement = (element) => {};

const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }

  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
};

const addExpense = () => {
  const name = transactionName.value;
  const amount = transactionAmount.value;
  const type = transactionType.value;
  const transactionDiv = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  transactionDiv.classList.add("transaction");
  list.appendChild(transactionDiv);

  transactionDiv.innerHTML = `<p class="transaction-name">${name}</p><p class="amount ${
    type === "income" ? "income" : "expense"
  }">${type === "income" ? "+" : "-"}${amount}</p>`;

  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");

  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });

  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");

  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });

  transactionDiv.appendChild(editButton);
  transactionDiv.appendChild(deleteButton);

  document.getElementById("list").appendChild(transactionDiv);

  //TODO: Error handling
  if (type === "income") {
    balanceValue += Number(amount);
  } else {
    balanceValue -= Number(amount);
  }

  balance.innerHTML = balanceValue;
};

btn.addEventListener("click", () => {
  addExpense();
});
