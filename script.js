document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("order-list");
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;

  loadOrders();

  const addOrderButtons = Array.from(
    document.querySelectorAll(".addOrderButton")
  );
  addOrderButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemName = this.alt;
      const itemPrice = parseFloat(this.getAttribute("data-price"));
      addOrder(itemName, itemPrice);
    });
  });

  document.getElementById("save-button").addEventListener("click", saveOrders);
  document
    .getElementById("clear-button")
    .addEventListener("click", clearOrders);
  document.getElementById("pay-button").addEventListener("click", payOrders);

  function addOrder(name, price) {
    const orderItem = document.createElement("div");
    orderItem.textContent = `${name}: ${price} THB`;

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function () {
      cancelOrder(orderItem, price);
    });

    orderItem.appendChild(cancelButton);
    orderList.appendChild(orderItem);

    totalPrice += price;
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(0)} THB`;
  }

  function cancelOrder(orderItem, price) {
    orderList.removeChild(orderItem);
    totalPrice -= price;
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(0)} THB`;
  }

  function saveOrders() {
    localStorage.setItem("orders", orderList.innerHTML);
    localStorage.setItem("totalPrice", totalPrice);
    Swal.fire({
      title: 'Orders Saved!',
      text: 'Your orders have been saved successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  function loadOrders() {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      orderList.innerHTML = savedOrders;
      totalPrice = parseFloat(localStorage.getItem("totalPrice"));
      totalPriceElement.textContent = `Total: ${totalPrice.toFixed(0)} THB`;
    }
  }

  function clearOrders() {
    Swal.fire({
      title: 'Clear Orders',
      text: 'Are you sure you want to clear the orders?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        orderList.innerHTML = "";
        totalPrice = 0;
        totalPriceElement.textContent = "Total: 0 THB";
        localStorage.removeItem("orders");
        localStorage.removeItem("totalPrice");
        Swal.fire(
          'Orders Cleared!',
          'Your orders have been cleared.',
          'success'
        );
      }
    });
  }

  function payOrders() {
    if (totalPrice > 0) {
      Swal.fire({
        title: 'Confirm Payment',
        text: `Proceed to pay ${totalPrice.toFixed(0)} THB?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Pay Now',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Payment Successful!',
            `You have paid ${totalPrice.toFixed(0)} THB.`,
            'success'
          );
          clearOrders();
        }
      });
    } else {
      Swal.fire({
        title: 'Empty Order List',
        text: 'Your order list is empty.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
});
