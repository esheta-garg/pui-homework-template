const rolls = {
    "Original": {
        "basePrice": 2.49,
        "imageFile": "original-cinnamon-roll.jpg"
    },
    "Apple": {
        "basePrice": 3.49,
        "imageFile": "apple-cinnamon-roll.jpg"
    },
    "Raisin": {
        "basePrice": 2.99,
        "imageFile": "raisin-cinnamon-roll.jpg"
    },
    "Walnut": {
        "basePrice": 3.49,
        "imageFile": "walnut-cinnamon-roll.jpg"
    },
    "Double-Chocolate": {
        "basePrice": 3.99,
        "imageFile": "double-chocolate-cinnamon-roll.jpg"
    },
    "Strawberry": {
        "basePrice": 3.99,
        "imageFile": "strawberry-cinnamon-roll.jpg"
    }    
};

const glazingType = { // dictionary that contains types of glazing and additional prices for each option
    "original": 0.00,
    "sugar milk": 0.00,
    "vanilla milk": 0.50,
    "double chocolate": 1.50
};


const packSizes = { "1": 1, "3": 3, "6": 5, "12": 10 }; // dictionary for pack size and multiplier value 
//const packSizes = { 1: 1, 3: 3, 6: 5, 12: 10 };

let cart = JSON.parse(localStorage.getItem('cart')) || []; 

console.log(localStorage.getItem('cart'))

//class for Roll, includes base price and glazing type
class Roll {
    constructor(rollType, rollGlazing, packSize) {
        this.type = rollType;//set the type of the roll
        this.glazing = rollGlazing;// set the glazing type of the roll
        this.size = packSize;//set the size of the roll
        console.log(packSize)//set the size of the roll pack
        this.glazingPrice = parseFloat(glazingType[rollGlazing])//get the price for the selected glazing type and parse it as a float
        this.basePrice = parseFloat(rolls[rollType]?.basePrice); //set the base price of the roll based on the selected roll type from the rolls object        this.glazingPrice = glazingType[rollGlazing];
        this.packMultiplier = packSizes[packSize] || 1;// determine the multiplier for the pack size.
        console.log(packSizes[packSize])

    }

    calculateRollPrice() {
        return (this.basePrice + this.glazingPrice) * this.packMultiplier;// calculates final price of roll
    }
   
}



function displayCartItems() {
    const container = document.getElementById('cart-items-container');// container element where cart items will be
    const template = document.getElementById('cart-item-template');//template for a cart item to clone for each item in the cart


    //clear the container to remove any previous cart items
    container.innerHTML = ''; 
    let totalPrice = 0;

    // loop through each item in the cart
    for (let index = 0; index < cart.length; index++) {
        const item = cart[index];
        const roll = new Roll(item.type, item.glazing, item.size); // new Roll object using the type, glazing, and size from the cart item
        const clone = document.importNode(template.content, true);//clone the template for a new cart item
        const itemPrice = roll.calculateRollPrice();//calculate the total price for the roll using the function calculateRollPrice


        // setting sources for images , details, price
        clone.querySelector('.cart-item-image').src = `../assets/products/${rolls[roll.type].imageFile}`;
        clone.querySelector('.cart-item-details').innerHTML = `${roll.type} cinnamon roll<br><br>Glazing: ${roll.glazing}<br><br>Pack Size: ${roll.size}`;
        clone.querySelector('.cart-item-price').textContent = `$${itemPrice.toFixed(2)}`;

        clone.querySelector('.cart-order').dataset.index = index;
        // store the index of the item in the dataset for easy reference in event handlers
        const removeButton = clone.querySelector('.remove-button');// get the remove button 
        removeButton.dataset.index = index;//set the index for the remove button

        // attach event listener to remove button directly
        removeButton.addEventListener('click', function() {
            removeItem(index);  // Call remove function with the correct index
        });

        container.appendChild(clone);
        totalPrice += itemPrice; // add item price to total
    }

    // update total price
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}

function addItemToCart(rollType, glazing, packSize) {
    const newRoll = new Roll(rollType, glazing, packSize); // create a new roll object
    cart.push(newRoll); // add the new roll to the cart
    localStorage.setItem('cart', JSON.stringify(cart)); // save the updated cart to local storage
    displayCartItems(); // update the cart display
}

function removeItem(index) {
    cart.splice(index, 1);  //method for removing an item from the cart array
    localStorage.setItem('cart', JSON.stringify(cart)); 
    displayCartItems();     
}


window.onload = function() {
    displayCartItems();
};




