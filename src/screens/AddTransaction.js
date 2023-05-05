import React, { useState, useEffect } from "react";
import axios from "axios";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { ClientCardRepository } from "../repositories/ClientCardRepository";
import { MedicineRepository } from "../repositories/MedicineRepository";

import { Alert } from "@mui/material";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { format } from "date-fns";

function AddTransaction() {
  const repository = new TransactionRepository();
  const clientCardRepository = new ClientCardRepository();
  const medicineRepository = new MedicineRepository();

  const [quotes, setQuotes] = useState([]);
  const [medOptions, setMedOptions] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);
  const [showCardErrorMessage, setShowCardErrorMessage] = useState(false);
  const [showMedicineErrorMessage, setShowMedicineErrorMessage] =
    useState(false);

  const [transaction, setTransaction] = useState({
    id: "",
    medicineId: "",
    clientCardId: "",
    quantity: 1,
    dateOfPurchase: null,
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(
          "https://api.quotable.io/random?tags=famous-quotes"
        );
        setQuotes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    const storedOptions = medicineRepository.getAll();
    setMedOptions(storedOptions);
  }, []);

  useEffect(() => {
    const storedOptions = clientCardRepository.getAll();
    setCcOptions(storedOptions);
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
    console.log(transaction);
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
    repository.add(transaction);
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

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Also, some inspiration:</h1>
          <p className="py-6">
            <strong>{quotes.content}</strong>
          </p>
          <p>
            <em>- {quotes.author}</em>
          </p>
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
                <Alert severity="warning">Medicine doesn't exist!</Alert>
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
                    required: true,
                  }}
                  isValidDate={(currentDate) =>
                    currentDate.isBefore(Datetime.moment())
                  }
                />
                <label className="label">
                  <span className="label-text">Medicine</span>
                </label>
                <select
                  name="medicineId"
                  onChange={handleInputChange}
                  className="input input-bordered"
                  value={transaction.medicineId}
                  required
                >
                  <option name="">Select an option</option>
                  {medOptions.map((option) => (
                    <option name="medicineId" key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <label className="label">
                  <span className="label-text">Client Card</span>
                </label>
                <select
                  name="clientCardId"
                  onChange={handleInputChange}
                  className="input input-bordered"
                  value={transaction.clientCardId}
                  required
                >
                  <option name="">Select an option</option>
                  {ccOptions.map((option) => (
                    <option
                      name="clientCardId"
                      key={option.id}
                      value={option.id}
                    >
                      {option.firstName} {option.lastName}, CNP {option.SSN}
                    </option>
                  ))}
                </select>

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
                  Add to repository
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
