import React, { useState, useEffect } from "react";
import axios from "axios";
import { MedicineRepository } from "../repositories/MedicineRepository";
import { Alert } from "@mui/material";

function AddMedicine() {
  const [quotes, setQuotes] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [medicine, setMedicine] = useState({
    id: "",
    name: "",
    producer: "",
    price: 0,
    needsPrescription: false,
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

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setMedicine((prevState) => ({
      ...prevState,
      [name]: name === "needsPrescription" ? checked : value,
    }));
  };

  function handleSubmit(event) {
    event.preventDefault();
    const repository = new MedicineRepository();
    repository.add(medicine);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
    setMedicine({
      id: "",
      name: "",
      producer: "",
      price: 0,
      needsPrescription: false,
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
                <Alert severity="success">Medicine added with success!</Alert>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  className="input input-bordered"
                  value={medicine.name}
                  onChange={handleInputChange}
                  pattern="[A-Za-z]+"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Producer</span>
                </label>
                <input
                  type="text"
                  name="producer"
                  placeholder="producer"
                  className="input input-bordered"
                  value={medicine.producer}
                  onChange={handleInputChange}
                  pattern="[A-Za-z]+"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="price"
                  className="input input-bordered"
                  value={medicine.price}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Needs prescription?</span>
                  <input
                    name="needsPrescription"
                    type="checkbox"
                    value={medicine.needsPrescription}
                    checked={medicine.needsPrescription}
                    onChange={handleInputChange}
                    className="checkbox checkbox-success"
                  />
                </label>
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

export default AddMedicine;
