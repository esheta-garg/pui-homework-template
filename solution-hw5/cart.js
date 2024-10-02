

class Roll {
    constructor(rollType, rollGlazing, packSize, rollPrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = rollPrice;
    }
}

const cart = [
    new Roll('Original', 'Sugar Milk', '1', 2.49),
    new Roll('Walnut', 'Vanilla Milk', '12', 39.90),
    new Roll('Raisin', 'Sugar Milk', '3', 8.97),
    new Roll('Apple', 'Original', '3', 10.47)
  ];

  // so basically, this is how you store an objcect from the constructor, Roll. and when you want to update the base price, you use the update price funtions which does that 
  // for the base prices


  document.query