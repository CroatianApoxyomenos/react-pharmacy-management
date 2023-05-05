class MedicineRepository {
  generateId() {
    const _index = this.getAll.length() + 1;
    return _index;
  }

  getAll() {
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    return medicines;
  }

  getById(id) {
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    const medicine = medicines.find((m) => m.id === id);
    return medicine;
  }

  add(medicine) {
    const medicines = this.getAll();
    medicine.id =
      medicines.length > 0
        ? Math.max(...medicines.map((medicine) => medicine.id)) + 1
        : 0;
    medicines.push(medicine);
    localStorage.setItem("medicines", JSON.stringify(medicines));
  }

  update(medicine) {
    const medicines = this.getAll();
    const index = medicines.findIndex((m) => m.id === medicine.id);
    if (index >= 0) {
      medicines[index] = medicine;
      localStorage.setItem("medicines", JSON.stringify(medicines));
    }
  }

  remove(id) {
    const medicines = this.getAll();
    const index = medicines.findIndex((m) => m.id === id);
    if (index >= 0) {
      medicines.splice(index, 1);
      localStorage.setItem("medicines", JSON.stringify(medicines));
    }
  }
}

export { MedicineRepository };
