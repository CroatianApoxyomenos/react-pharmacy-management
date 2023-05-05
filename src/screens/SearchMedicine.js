import React, { useEffect, useState } from "react";
import { MedicineRepository } from "../repositories/MedicineRepository";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { TransactionRepository } from "../repositories/TransactionRepository";

function SearchMedicine() {
  const repository = new MedicineRepository();
  const transactionRepository = new TransactionRepository();
  const [allMedicines, setAllMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  function getAllMedicines() {
    const storedMedicines = repository.getAll();
    const storedTransactions = transactionRepository.getAll();

    if (storedMedicines) {
      const updatedMedicines = storedMedicines.map((medicine) => {
        let quantity = 0;
        const numOfTransactions = storedTransactions.filter(
          (obj) => parseInt(obj.medicineId) === medicine.id
        );
        numOfTransactions.forEach((obj) => {
          quantity += parseInt(obj.quantity);
        });

        return {
          ...medicine,
          transactions: numOfTransactions.length,
          quantity: quantity,
        };
      });
      setAllMedicines(updatedMedicines);
    }
  }

  useEffect(() => {
    getAllMedicines();
  }, []);

  const filteredMedicines = allMedicines.filter(
    (obj) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.price.toString().includes(searchQuery)
  );

  function handleDelete(id) {
    repository.remove(id);
    getAllMedicines();
  }

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="overflow-y-auto h-[65vh] w-[85vh] flex items-center">
          <table className="table table-compact w-full ">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Producer</th>
                <th>Price</th>
                <th>Prescription</th>
                <th>Transactions</th>
                <th>Sold</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines
                .sort((a, b) => a.quantity + b.quantity)
                .map((medicine) => (
                  <tr key={medicine.id} className="hover">
                    <th>{medicine.id}</th>
                    <td>{medicine.name}</td>
                    <td>{medicine.producer}</td>
                    <td>{medicine.price}</td>
                    <td>{medicine.needsPrescription ? "Yes" : "No"}</td>
                    <td>{medicine.transactions}</td>
                    <td>{medicine.quantity}</td>
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
                <th>Transactions</th>
                <th>Sold</th>
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
                  <span className="label-text">Query</span>
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchMedicine;
