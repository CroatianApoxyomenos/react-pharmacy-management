import React, { useEffect, useState } from "react";
import { TransactionRepository } from "../repositories/TransactionRepository";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { parse, isWithinInterval } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

function SearchTransaction() {
  const repository = new TransactionRepository();
  const [allTransactions, setAllTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    startDate: "01/01/1970",
    endDate: format(new Date(), "dd/MM/yyyy"),
  });

  function getAllTransactions() {
    const storedTransactions = repository.getAll();
    if (storedTransactions) {
      setAllTransactions(storedTransactions);
    }
  }

  useEffect(() => {
    getAllTransactions();
  }, []);

  const filteredTransactions = allTransactions.filter((obj) =>
    isWithinInterval(
      parse(obj.dateOfPurchase, "dd/MM/yyyy HH:mm", new Date()),
      {
        start: parse(searchQuery.startDate, "dd/MM/yyyy", new Date()),
        end: parse(searchQuery.endDate, "dd/MM/yyyy", new Date()),
      }
    )
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const date = value instanceof Date ? value : new Date(value);
    const formattedDate = format(date, "dd/MM/yyyy");
    setSearchQuery((prevSearchQuery) => ({
      ...prevSearchQuery,
      [name]: formattedDate,
    }));
  };

  function handleDelete(id) {
    repository.remove(id);
    getAllTransactions();
  }

  function handleDeleteAll() {
    filteredTransactions.map((transaction) => handleDelete(transaction.id));
  }

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="overflow-y-auto h-[65vh] w-[90vh] flex items-center">
          <table className="table table-compact w-full ">
            <thead>
              <tr>
                <th></th>
                <th>Date and time of Purchase</th>
                <th>Quantity</th>
                <th>Medicine ID</th>
                <th>Client Card ID</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover">
                  <th>{transaction.id}</th>
                  <td>{transaction.dateOfPurchase}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.medicineId}</td>
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
                <th>Date and time of Purchase</th>
                <th>Quantity</th>
                <th>Medicine ID</th>
                <th>Client Card ID</th>
                <th>Delete</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold">&lt;--- Search</h1>
          <p className="py-6">
            <em>As simple as that</em>
          </p>
          <h1 className="text-3xl font-bold">Result ---&gt;</h1>
        </div>
        <form>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Date</span>
                </label>
                <DatePicker
                  name="startDate"
                  className="input input-bordered"
                  value={searchQuery.startDate}
                  onChange={(date) =>
                    handleInputChange({
                      target: { name: "startDate", value: date },
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  required
                />
                <label className="label">
                  <span className="label-text">End Date</span>
                </label>
                <DatePicker
                  name="endDate"
                  className="input input-bordered"
                  value={searchQuery.endDate}
                  onChange={(date) =>
                    handleInputChange({
                      target: { name: "endDate", value: date },
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={handleDeleteAll}>
                  Delete from interval
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchTransaction;
