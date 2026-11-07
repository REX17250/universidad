// Takes 1 second
export function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id < 0) {
        reject("id could not be negative");
        return;
      }

      resolve({ id, name: "Rodolfo" });
    }, 1000);
  });
}

// Takes 1.5 seconds
export function getOrders(userId) {
  return new Promise((resolve, reject) => {
    if (userId < 0) {
            reject("rejected; user ID negative");
            return;
        }
    setTimeout(() => {
      resolve([
        { id: 1, product: "Laptop", price: 5000 },
        { id: 2, product: "Mouse", price: 100 }
      ]);
    }, 1500);
  });
}

// Takes 1.2 seconds
export function getProductList() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(["Laptop", "Mouse", "Keyboard"]);
    }, 1200);
  });
}

// Takes 1.3 seconds
export function getPaymentStatus(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (orderId < 0) {
        reject("orderId could not be negative");
        return;
      }

      const payments = {
        1: { orderId: 1, status: "paid", method: "credit card" },
        2: { orderId: 2, status: "pending", method: "cash" }
      };

      const payment = payments[orderId];

      if (!payment) {
        reject("payment not found");
        return;
      }

      resolve(payment);
    }, 1300);
  });
}

// Takes 1.4 seconds
export function getShippingInfo(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (orderId < 0) {
        reject("orderId could not be negative");
        return;
      }

      const shipping = {
        1: { orderId: 1, company: "DHL", status: "shipped" },
        2: { orderId: 2, company: "FedEx", status: "preparing" }
      };

      const info = shipping[orderId];

      if (!info) {
        reject("shipping info not found");
        return;
      }

      resolve(info);
    }, 1400);
  });
}

// Takes 1 second
export function getProductDetail(productName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = {
        Laptop: { name: "Laptop", category: "Technology", stock: 4 },
        Mouse: { name: "Mouse", category: "Accessories", stock: 15 },
        Keyboard: { name: "Keyboard", category: "Accessories", stock: 0 }
      };

      const product = products[productName];

      if (!product) {
        reject("product not found");
        return;
      }

      resolve(product);
    }, 1000);
  });
}