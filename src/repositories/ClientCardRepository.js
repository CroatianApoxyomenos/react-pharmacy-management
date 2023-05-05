class ClientCardRepository {
  generateId() {
    const _index = this.getAll.length() + 1;
    return _index;
  }

  getAll() {
    const clientCards = JSON.parse(localStorage.getItem("clientCards") || "[]");
    return clientCards;
  }

  getById(id) {
    const clientCards = JSON.parse(localStorage.getItem("clientCards") || "[]");
    const clientCard = clientCards.find((cc) => cc.id === id);
    return clientCard;
  }

  add(clientCard) {
    const clientCards = this.getAll();
    console.log(clientCards);
    clientCard.id =
      clientCards.length > 0
        ? Math.max(...clientCards.map((clientCard) => clientCard.id)) + 1
        : 0;
    clientCards.push(clientCard);
    localStorage.setItem("clientCards", JSON.stringify(clientCards));
  }

  update(clientCard) {
    const clientCards = this.getAll();
    const index = clientCards.findIndex((cc) => cc.id === clientCard.id);
    if (index >= 0) {
      clientCards[index] = clientCard;
      localStorage.setItem("clientCards", JSON.stringify(clientCards));
    }
  }

  remove(id) {
    const clientCards = this.getAll();
    const index = clientCards.findIndex((cc) => cc.id === id);
    if (index >= 0) {
      clientCards.splice(index, 1);
      localStorage.setItem("clientCards", JSON.stringify(clientCards));
    }
  }
}

export { ClientCardRepository };
