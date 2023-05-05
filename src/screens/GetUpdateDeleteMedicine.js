import React, { useState, useEffect } from "react";
import { MedicineRepository } from "../repositories/MedicineRepository";
import { Alert } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function GetUpdateDeleteMedicine() {
  const repository = new MedicineRepository();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [allMedicines, setAllMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    price: 0,
    percentage: 0,
  });
  const [medicine, setMedicine] = useState({
    id: "",
    name: "",
    producer: "",
    price: 0,
    needsPrescription: false,
  });

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getAllMedicines() {
    const storedMedicines = repository.getAll();
    if (storedMedicines) {
      setAllMedicines(storedMedicines);
    }
  }

  useEffect(() => {
    getAllMedicines();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setMedicine((prevState) => ({
      ...prevState,
      [name]: name === "needsPrescription" ? checked : value,
    }));
  };

  const handleIncreaseInputChange = (event) => {
    const { name, value } = event.target;
    setSearchQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filteredMedicines = allMedicines.filter(
    (obj) => obj.price < parseInt(searchQuery.price)
  );

  function handleSubmit(event) {
    event.preventDefault();
    repository.update(medicine);
    setShowSuccessMessage(true);
    getAllMedicines();
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

  function handleSubmitIncreasePrice(event) {
    event.preventDefault();
    console.log("entered handleSubmitIncreasePrice");
    console.log("filtered meds: ", filteredMedicines);
    if (filteredMedicines.length > 0) {
      const updatedMedicines = filteredMedicines.map((medicine) => {
        const newPrice =
          parseInt(medicine.price) +
          parseInt(medicine.price) * (searchQuery.percentage / 100);
        const updatedMedicine = { ...medicine, price: newPrice };
        return updatedMedicine;
      });
      updatedMedicines.forEach((updatedMedicine) => {
        repository.update(updatedMedicine);
      });
      setShowSuccessMessage(true);
      getAllMedicines();
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      setSearchQuery({
        price: 0,
        percentage: 0,
      });
    } else {
      setShowErrorMessage(true);
      getAllMedicines();
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    }
  }

  function handleEdit(medicine) {
    setMedicine({
      id: medicine.id,
      name: medicine.name,
      producer: medicine.producer,
      price: medicine.price,
      needsPrescription: medicine.needsPrescription,
    });
  }

  function handleDelete(id) {
    repository.remove(id);
    getAllMedicines();
  }

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="overflow-y-auto h-[65vh] w-[65vh] flex items-center">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Producer</th>
                <th>Price</th>
                <th>Prescription</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {allMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover">
                  <th>{medicine.id}</th>
                  <td onClick={() => handleEdit(medicine)}>{medicine.name}</td>
                  <td>{medicine.producer}</td>
                  <td>{medicine.price}</td>
                  <td>{medicine.needsPrescription ? "Yes" : "No"}</td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDelete(medicine.id)}
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
                <th>Name</th>
                <th>Producer</th>
                <th>Price</th>
                <th>Prescription</th>
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

        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange}>
                    <Tab label="Update medicine" value="1" />
                    <Tab label="Increase price" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <form onSubmit={handleSubmit}>
                    {showSuccessMessage && (
                      <Alert severity="success">Medicine updated!</Alert>
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
                        Update medicine
                      </button>
                    </div>
                  </form>
                </TabPanel>
                <TabPanel value="2">
                  <form onSubmit={handleSubmitIncreasePrice}>
                    {showSuccessMessage && (
                      <Alert severity="success">Medicine updated!</Alert>
                    )}
                    {showErrorMessage && (
                      <Alert severity="warning">No medicines found!</Alert>
                    )}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Price under</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        placeholder="price"
                        className="input input-bordered"
                        value={searchQuery.price}
                        onChange={handleIncreaseInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Percentage</span>
                      </label>
                      <input
                        type="number"
                        name="percentage"
                        placeholder="percentage"
                        className="input input-bordered"
                        value={searchQuery.percentage}
                        onChange={handleIncreaseInputChange}
                        min="1"
                        required
                      />
                    </div>

                    <div className="form-control mt-6">
                      <button className="btn btn-primary" type="submit">
                        Update medicine
                      </button>
                    </div>
                  </form>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetUpdateDeleteMedicine;
