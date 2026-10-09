
const form = document.getElementById("orderForm");
const food = document.getElementById("food");
const quantity = document.getElementById("quantity");
const total = document.getElementById("total");
const status = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

const prices = {
  "Veg Burger": 120,
  "Pizza": 180,
  "French Fries": 80,
  "Sandwich": 100
};

function calculateTotal() {
  const price = prices[food.value];
  const qty = Number(quantity.value);
  total.textContent = price * qty;
}

food.addEventListener("change", calculateTotal);
quantity.addEventListener("input", calculateTotal);

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const qty = Number(quantity.value);

  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    status.textContent = "Please select a quantity from 1 to 20.";
    return;
  }

  const order = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    food: food.value,
    quantity: qty,
    address: document.getElementById("address").value.trim(),
    message: document.getElementById("message").value.trim(),
    total: prices[food.value] * qty
  };

  // Google Apps Script URL will be added in Experiment 2.
  const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

  if (SCRIPT_URL.startsWith("PASTE_")) {
    status.textContent =
      "Website is ready. Connect Google Apps Script to save orders.";
    return;
  }

  submitBtn.disabled = true;
  status.textContent = "Submitting your order...";

  try {
    const body = new URLSearchParams(order);

    // Apps Script accepts form-encoded POST requests.
    // no-cors means the browser cannot read the server response.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: body
    });

    status.textContent =
      "Submission sent. Please verify the order in the Google Sheet.";
    form.reset();
    calculateTotal();
  } catch (error) {
    status.textContent =
      "Could not send the order. Check your internet connection and try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

calculateTotal();