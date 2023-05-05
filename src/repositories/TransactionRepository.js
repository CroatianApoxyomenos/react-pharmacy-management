import { ClientCardRepository } from "./ClientCardRepository";
import { MedicineRepository } from "./MedicineRepository";

class TransactionRepository {
  medicineRepository = new MedicineRepository();
  clientCardRepository = new ClientCardRepository();

  generateId() {
    const _index = this.getAll.length() + 1;
    return _index;
  }

  getAll() {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    return transactions;
  }

  getAllTransactionsWithDiscounts() {
    const storedTransactions = this.getAll();
    const storedMedicines = this.medicineRepository.getAll();

    if (storedTransactions) {
      const updatedTransactions = storedTransactions.map((transaction) => {
        const medicine = storedMedicines.find(
          (m) => m.id === parseInt(transaction.medicineId)
        );
        const totalPrice = transaction.quantity * medicine.price;

        let discountedPrice = totalPrice;
        let discount = 0;
        if (
          this.clientCardRepository.getById(parseInt(transaction.clientCardId))
        ) {
          const discountPercentage = medicine.needsPrescription ? 0.15 : 0.1;
          discount = totalPrice * discountPercentage;
          discountedPrice = totalPrice - discount;
        }

        return {
          ...transaction,
          totalPrice: discountedPrice,
          discount: discount,
        };
      });
      return updatedTransactions;
    }
  }

  getById(id) {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const transaction = transactions.find((tr) => tr.id === id);
    return transaction;
  }

  add(transaction) {
    const transactions = this.getAll();
    transaction.id =
      transactions.length > 0
        ? Math.max(...transactions.map((transaction) => transaction.id)) + 1
        : 0;
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  update(transaction) {
    const transactions = this.getAll();
    const index = transactions.findIndex((tr) => tr.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }

  remove(id) {
    const transactions = this.getAll();
    const index = transactions.findIndex((tr) => tr.id === id);
    if (index >= 0) {
      transactions.splice(index, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }
}

export { TransactionRepository };
