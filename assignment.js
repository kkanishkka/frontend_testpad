// Sample Data (for context, you can replace with your actual data)
const Items = [
  {
    id: "item1",
    itemName: "Butter Roti",
    rate: 20,
    taxes: [
      {
        name: "Service Charge",
        rate: 10,
        isInPercent: 'Y'
      }
    ],
    category: {
      categoryId: "C2"
    }
  },
  {
    id: "item2",
    itemName: "Paneer Butter Masala",
    rate: 100,
    taxes: [
      {
        name: "Service Charge",
        rate: 10,
        isInPercent: 'Y'
      },
      {
        name: "VAT",
        rate: 5,
        isInPercent: 'Y'
      }
    ],
    category: {
      categoryId: "C1"
    }
  }
];

const Categories = [
  {
    id: "C1",
    categoryName: "Platters",
    superCategory: {
      superCategoryName: "South Indian",
      id: "SC1"
    }
  },
  {
    id: "C2",
    categoryName: "Breads",
    superCategory: {
      superCategoryName: "North Indian",
      id: "SC2"
    }
  }
];

const bill = {
  id: "B1",
  billNumber: 1,
  opentime: "06 Nov 2020 14:19",
  customerName: "CodeQuotient",
  billItems: [
    {
      id: "item2",
      quantity: 3,
      discount: {
        rate: 10,
        isInPercent: 'Y'
      }
    },
    {
      id: "item1",
      quantity: 2,
      discount: {
        rate: 5,
        isInPercent: 'N' // flat discount
      }
    }
  ]
};

// Task 1: Simple enriched bill items with item name and quantity
function getBillSummary(bill, items) {
  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: bill.billItems.map(billItem => {
      const item = items.find(i => i.id === billItem.id);
      return {
        id: billItem.id,
        name: item ? item.itemName : "Unknown Item",
        quantity: billItem.quantity
      };
    })
  };
}

// Task 2: Detailed bill with taxes, discount, amount, category info and total amount
function getBillDetails(bill, items, categories) {
  let totalAmount = 0;

  const detailedBillItems = bill.billItems.map(billItem => {
    const item = items.find(i => i.id === billItem.id);

    if (!item) {
      return null; // or handle missing item scenario
    }

    // Calculate base amount (rate * quantity)
    const baseAmount = item.rate * billItem.quantity;

    // Calculate discount amount
    let discountAmount = 0;
    if (billItem.discount) {
      if (billItem.discount.isInPercent === 'Y') {
        discountAmount = (baseAmount * billItem.discount.rate) / 100;
      } else {
        discountAmount = billItem.discount.rate;
      }
    }

    const amountAfterDiscount = baseAmount - discountAmount;

    // Calculate total tax amount
    let totalTaxAmount = 0;
    const taxesWithAmount = (item.taxes || []).map(tax => {
      let taxAmount = 0;
      if (tax.isInPercent === 'Y') {
        taxAmount = (amountAfterDiscount * tax.rate) / 100;
      } else {
        taxAmount = tax.rate;
      }
      totalTaxAmount += taxAmount;
      return { ...tax };
    });

    // Final amount for this bill item
    const finalAmount = amountAfterDiscount + totalTaxAmount;

    totalAmount += finalAmount;

    // Find category and super category names
    const categoryObj = categories.find(c => c.id === item.category.categoryId);
    const categoryName = categoryObj ? categoryObj.categoryName : "";
    const superCategoryName = categoryObj && categoryObj.superCategory ? categoryObj.superCategory.superCategoryName : "";

    return {
      id: billItem.id,
      name: item.itemName,
      quantity: billItem.quantity,
      discount: billItem.discount || null,
      taxes: taxesWithAmount,
      amount: parseFloat(finalAmount.toFixed(2)),
      categoryName,
      superCategoryName
    };
  }).filter(Boolean); // remove null if any item missing

  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: detailedBillItems,
    "Total Amount": parseFloat(totalAmount.toFixed(2))
  };
}

// Example usage:
console.log("Task 1 Result:");
console.log(JSON.stringify(getBillSummary(bill, Items), null, 2));

console.log("\nTask 2 Result:");
console.log(JSON.stringify(getBillDetails(bill, Items, Categories), null, 2));
