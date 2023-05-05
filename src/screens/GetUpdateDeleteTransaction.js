import React, { useState, useEffect } from "react";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { MedicineRepository } from "../repositories/MedicineRepository";
import { ClientCardRepository } from "../repositories/ClientCardRepository";
import { Alert } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { format } from "date-fns";

function GetUpdateDeleteTransaction() {
  const repository = new TransactionRepository();
  const medicineRepository = new MedicineRepository();
  const clientCardRepository = new ClientCardRepository();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);
  const [showCardErrorMessage, setShowCardErrorMessage] = useState(false);
  const [showMedicineErrorMessage, setShowMedicineErrorMessage] =
    useState(false);

  const [allTransactions, setAllTransactions] = useState([]);
  const [transaction, setTransaction] = useState({
    id: "",
    medicineId: "",
    clientCardId: "",
    quantity: 1,
    dateOfPurchase: null,
    totalPrice: 0,
    discount: 0,
  });

  function getAllTransactions() {
    setAllTransactions(repository.getAllTransactionsWithDiscounts());
  }

  useEffect(() => {
    getAllTransactions();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "dateOfPurchase") {
      const date = value instanceof Date ? value : new Date(value);
      const formattedDate = format(date, "dd/MM/yyyy HH:mm");
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        [name]: formattedDate,
      }));
    } else {
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        [name]: value,
      }));
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!transaction.dateOfPurchase) {
      setShowDateErrorMessage(true);
      setTimeout(() => {
        setShowDateErrorMessage(false);
      }, 5000);
      return;
    }
    if (
      transaction.clientCardId &&
      !clientCardRepository.getById(parseInt(transaction.clientCardId))
    ) {
      setShowCardErrorMessage(true);
      setTimeout(() => {
        setShowCardErrorMessage(false);
      }, 5000);
      return;
    }
    if (
      !transaction.medicineId ||
      !medicineRepository.getById(parseInt(transaction.medicineId))
    ) {
      setShowMedicineErrorMessage(true);
      setTimeout(() => {
        setShowMedicineErrorMessage(false);
      }, 5000);
      return;
    }
    repository.update(transaction);
    getAllTransactions();
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
    setTransaction({
      id: "",
      medicineId: "",
      clientCardId: "",
      quantity: 1,
      dateOfPurchase: null,
    });
  }

  function handleEdit(transaction) {
    setTransaction({
      id: transaction.id,
      medicineId: transaction.medicineId,
      clientCardId: transaction.clientCardId,
      quantity: transaction.quantity,
      dateOfPurchase: transaction.dateOfPurchase,
    });
  }

  function handleDelete(id) {
    repository.remove(id);
    getAllTransactions();
  }

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="overflow-y-auto h-[65vh] w-[107vh] flex items-center">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>Date of Purchase</th>
                <th>Total Price</th>
                <th>Discount</th>
                <th>Medicine ID</th>
                <th>Quantity</th>
                <th>Client Card ID</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover">
                  <th>{transaction.id}</th>
                  <td onClick={() => handleEdit(transaction)}>
                    {transaction.dateOfPurchase}
                  </td>
                  <td>{transaction.totalPrice.toFixed(2)}</td>
                  <td>{transaction.discount.toFixed(2)}</td>
                  <td>{transaction.medicineId}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.clientCardId}</td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <DeleteForeverIcon />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>Date of Purchase</th>
                <th>Total Price</th>
                <th>Discount</th>
                <th>Medicine ID</th>
                <th>Quantity</th>
                <th>Client Card ID</th>
                <th>Delete</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold">&lt;------ Edit</h1>
          <p className="py-6">
            <em>As simple as that</em>
          </p>
          <h1 className="text-3xl font-bold">Read ------&gt;</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              {showSuccessMessage && (
                <Alert severity="success">
                  Transaction added with success!
                </Alert>
              )}

              {showDateErrorMessage && (
                <Alert severity="warning">You must select date and time!</Alert>
              )}
              {showCardErrorMessage && (
                <Alert severity="warning">Client Card ID doesn't exist!</Alert>
              )}
              {showMedicineErrorMessage && (
                <Alert severity="warning">Medicine ID doesn't exist!</Alert>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of purchase</span>
                </label>
                <Datetime
                  name="dateOfPurchase"
                  readOnly={true}
                  className="input input-bordered"
                  value={transaction.dateOfPurchase}
                  onChange={(date) =>
                    handleInputChange({
                      target: { name: "dateOfPurchase", value: date },
                    })
                  }
                  dateFormat="DD/MM/YYYY"
                  timeFormat="HH:mm"
                  inputProps={{
                    placeholder: "Select date and time",
                    readOnly: true,
                  }}
                  isValidDate={(currentDate) =>
                    currentDate.isBefore(Datetime.moment())
                  }
                  required
                />
                <label className="label">
                  <span className="label-text">Medicine ID</span>
                </label>
                <input
                  type="number"
                  name="medicineId"
                  placeholder="Medicine ID"
                  className="input input-bordered"
                  value={transaction.medicineId}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                <label className="label">
                  <span className="label-text">Client Card ID</span>
                </label>
                <input
                  type="number"
                  name="clientCardId"
                  placeholder="Client Card ID"
                  className="input input-bordered"
                  value={transaction.clientCardId}
                  onChange={handleInputChange}
                  min="0"
                />
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="quantity"
                  className="input input-bordered"
                  value={transaction.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
                  Update transaction
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GetUpdateDeleteTransaction;
