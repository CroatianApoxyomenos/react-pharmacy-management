import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";

import React from "react";

function HomeScreen() {
  const [option, setOption] = useState(0);
  return (
    <div className="drawer h-[82vh]">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div
          className="hero h-[82vh]"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
              <p className="mb-5">
                Welcome to my online pharmacy management system! I am here to
                make your life easier by providing you with convinient access to
                easy to use pharmaceutical management.
              </p>

              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button mx-3"
                onClick={() => setOption(1)}
              >
                Medicines
              </label>
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button mx-3"
                onClick={() => setOption(2)}
              >
                Client Cards
              </label>
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button mx-3"
                onClick={() => setOption(3)}
              >
                Transactions
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side h-[82vh]">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
          <li>
            {option === 1 ? (
              <LinkContainer to="/add-medicine">
                <p>Add a medicine</p>
              </LinkContainer>
            ) : option === 2 ? (
              <LinkContainer to="/add-client-card">
                <p>Add a client card</p>
              </LinkContainer>
            ) : (
              <LinkContainer to="/add-transaction">
                <p>Add a transaction</p>
              </LinkContainer>
            )}
          </li>
          <li>
            {option === 1 ? (
              <LinkContainer to="/get-and-update-medicine">
                <p>Get/ update/ delete medicines</p>
              </LinkContainer>
            ) : option === 2 ? (
              <LinkContainer to="/get-and-update-client-cards">
                <p>Get/ update/ delete cards</p>
              </LinkContainer>
            ) : (
              <LinkContainer to="/get-and-update-transactions">
                <p>Get/ update/ delete transactions</p>
              </LinkContainer>
            )}
          </li>
          <li>
            {option === 1 ? (
              <LinkContainer to="/search-medicine">
                <p>Search medicines and get profitability report</p>
              </LinkContainer>
            ) : option === 2 ? (
              <LinkContainer to="/search-client-card">
                <p>Search client cards and get discount report</p>
              </LinkContainer>
            ) : (
              <LinkContainer to="/search-transaction">
                <p>Search and delete transactions by date</p>
              </LinkContainer>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomeScreen;
