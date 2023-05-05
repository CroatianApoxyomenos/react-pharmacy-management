import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import AddMedicine from "./screens/AddMedicine";
import GetUpdateDeleteMedicine from "./screens/GetUpdateDeleteMedicine";
import SearchMedicine from "./screens/SearchMedicine";
import AddClientCard from "./screens/AddClientCard";
import GetUpdateDeleteClientCard from "./screens/GetUpdateDeleteClientCard";
import SearchClientCard from "./screens/SearchClientCard";
import AddTransaction from "./screens/AddTransaction";
import GetUpdateDeleteTransaction from "./screens/GetUpdateDeleteTransaction";
import SearchTransaction from "./screens/SearchTransaction";

function App() {
  return (
    <div>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/add-medicine" element={<AddMedicine />} />
            <Route path="/add-client-card" element={<AddClientCard />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route
              path="/get-and-update-medicine"
              element={<GetUpdateDeleteMedicine />}
            />
            <Route
              path="/get-and-update-client-cards"
              element={<GetUpdateDeleteClientCard />}
            />
            <Route
              path="/get-and-update-transactions"
              element={<GetUpdateDeleteTransaction />}
            />
            <Route path="/search-medicine" element={<SearchMedicine />} />
            <Route path="/search-client-card" element={<SearchClientCard />} />
            <Route path="/search-transaction" element={<SearchTransaction />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
export default App;
