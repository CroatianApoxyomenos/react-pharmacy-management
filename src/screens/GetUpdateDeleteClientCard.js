import React, { useState, useEffect } from "react";
import { ClientCardRepository } from "../repositories/ClientCardRepository";
import { Alert } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import moment from "moment";

function GetUpdateDeleteClientCard() {
  const repository = new ClientCardRepository();

  const eighteenYearsAgo = moment().subtract(18, "years");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [allClientCards, setAllClientCards] = useState([]);
  const [clientCard, setClientCard] = useState({
    id: "",
    firstName: "",
    lastName: "",
    dateOfBirth: 0,
    dateOfRegister: 0,
    SSN: "",
  });

  function getAllClientCards() {
    const storedClientCards = repository.getAll();
    if (storedClientCards) {
      setAllClientCards(storedClientCards);
    }
  }

  useEffect(() => {
    getAllClientCards();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "dateOfRegister" || name === "dateOfBirth") {
      const date = value instanceof Date ? value : new Date(value);
      const formattedDate = format(date, "dd/MM/yyyy");
      setClientCard((prevClientCard) => ({
        ...prevClientCard,
        [name]: formattedDate,
      }));
    } else {
      setClientCard((prevClientCard) => ({
        ...prevClientCard,
        [name]: value,
      }));
    }
  };

  function verifySSN(SSN) {
    const allClientCards = repository.getAll();
    const filteredClientCards = allClientCards.filter((obj) =>
      obj.SSN.includes(SSN)
    );
    if (filteredClientCards.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (verifySSN(clientCard.SSN)) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    } else {
      repository.update(clientCard);
      getAllClientCards();
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      setClientCard({
        id: "",
        firstName: "",
        lastName: "",
        dateOfBirth: 0,
        dateOfRegister: 0,
        SSN: "",
      });
    }
  }

  function handleEdit(clientCard) {
    setClientCard({
      id: clientCard.id,
      firstName: clientCard.firstName,
      lastName: clientCard.lastName,
      dateOfBirth: clientCard.dateOfBirth,
      dateOfRegister: clientCard.dateOfRegister,
      SSN: clientCard.SSN,
    });
  }

  function handleDelete(id) {
    repository.remove(id);
    getAllClientCards();
  }

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="overflow-y-auto h-[65vh] w-[90vh] flex items-center">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Date of Register</th>
                <th>SSN</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {allClientCards.map((clientCard) => (
                <tr key={clientCard.id} className="hover">
                  <th>{clientCard.id}</th>
                  <td onClick={() => handleEdit(clientCard)}>
                    {clientCard.firstName}
                  </td>
                  <td>{clientCard.lastName}</td>
                  <td>{clientCard.dateOfBirth}</td>
                  <td>{clientCard.dateOfRegister}</td>
                  <td>{clientCard.SSN}</td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDelete(clientCard.id)}
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Date of Register</th>
                <th>SSN</th>
                <th>Delete</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold">&lt;--- Edit</h1>
          <p className="py-6">
            <em>As simple as that</em>
          </p>
          <h1 className="text-3xl font-bold">Read ---&gt;</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              {showSuccessMessage && (
                <Alert severity="success">Client Card updated!</Alert>
              )}
              {showErrorMessage && (
                <Alert severity="warning">SSN already exists!</Alert>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First name</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  className="input input-bordered"
                  value={clientCard.firstName}
                  onChange={handleInputChange}
                  pattern="[A-Za-z]+"
                  required
                />
                <label className="label">
                  <span className="label-text">Last name</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="input input-bordered"
                  value={clientCard.lastName}
                  onChange={handleInputChange}
                  pattern="[A-Za-z]+"
                  required
                />
                <label className="label">
                  <span className="label-text">Date of birth</span>
                </label>
                <DatePicker
                  name="dateOfBirth"
                  className="input input-bordered"
                  value={clientCard.dateOfBirth}
                  onChange={(date) =>
                    handleInputChange({
                      target: { name: "dateOfBirth", value: date },
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  maxDate={eighteenYearsAgo.toDate()}
                  popperPlacement="top-end"
                  fixedHeight
                  required
                />
                <label className="label">
                  <span className="label-text">Date of register</span>
                </label>
                <DatePicker
                  name="dateOfRegister"
                  className="input input-bordered"
                  value={clientCard.dateOfRegister}
                  onChange={(date) =>
                    handleInputChange({
                      target: { name: "dateOfRegister", value: date },
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  maxDate={new Date()}
                  popperPlacement="top-end"
                  fixedHeight
                  todayButton="Today"
                  required
                />
                <label className="label">
                  <span className="label-text">SSN</span>
                </label>
                <input
                  type="text"
                  name="SSN"
                  placeholder="SSN"
                  className="input input-bordered"
                  value={clientCard.SSN}
                  onChange={handleInputChange}
                  pattern="^[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">
                  Update Client Card
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GetUpdateDeleteClientCard;
