import React, { useEffect, useState } from "react";
import { ClientCardRepository } from "../repositories/ClientCardRepository";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { TransactionRepository } from "../repositories/TransactionRepository";

function SearchClientCard() {
  const repository = new ClientCardRepository();
  const transactionRepository = new TransactionRepository();

  const [allClientCards, setAllClientCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  function getAllClientCards() {
    const storedClientCards = repository.getAll();
    const storedTransactions =
      transactionRepository.getAllTransactionsWithDiscounts();

    if (storedClientCards) {
      const updatedClientCards = storedClientCards.map((cc) => {
        let totalDiscount = 0;
        const numOfTransactions = storedTransactions.filter(
          (obj) => parseInt(obj.clientCardId) === cc.id
        );
        numOfTransactions.forEach((obj) => (totalDiscount += obj.discount));

        return {
          ...cc,
          discount: totalDiscount,
        };
      });
      setAllClientCards(updatedClientCards);
    }
  }

  useEffect(() => {
    getAllClientCards();
  }, []);

  const filteredClientCards = allClientCards.filter(
    (obj) =>
      obj.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.dateOfBirth.includes(searchQuery) ||
      obj.dateOfRegister.includes(searchQuery) ||
      obj.SSN.includes(searchQuery)
  );
  console.log(filteredClientCards);
  function handleDelete(id) {
    repository.remove(id);
    getAllClientCards();
  }

  return (
    <div className="hero h-[82vh]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="overflow-y-auto h-[65vh] w-[105vh] flex items-center">
          <table className="table table-compact w-full ">
            <thead>
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Date of Register</th>
                <th>SSN</th>
                <th>Discount</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientCards
                .sort((a, b) => a.discount < b.discount)
                .map((clientCard) => (
                  <tr key={clientCard.id} className="hover">
                    <th>{clientCard.id}</th>
                    <td>{clientCard.firstName}</td>
                    <td>{clientCard.lastName}</td>
                    <td>{clientCard.dateOfBirth}</td>
                    <td>{clientCard.dateOfRegister}</td>
                    <td>{clientCard.SSN}</td>
                    <td>{clientCard.discount}</td>
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
                <th>Discount</th>
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

export default SearchClientCard;
