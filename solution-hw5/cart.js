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


//class for Roll, includes base price and glazing type
class Roll {
    constructor(rollType, rollGlazing, packSize) {
        this.type = rollType;
        this.glazing = rollGlazing;
        this.size = packSize;
        this.basePrice = rolls[rollType].basePrice;//set the base price of the roll based on the selected roll type from the rolls object
        this.glazingPrice = glazingType[rollGlazing.toLowerCase()];//retrieve the glazing price based on the selected glazing type, convert to lowercase
        this.packMultiplier = packSizes[packSize] || 1;// determine the multiplier for the pack size.

    }
   
}


let cart = [
    new Roll('Original', 'Sugar Milk', '1'),
    new Roll('Walnut', 'Vanilla Milk', '12'),
    new Roll('Raisin', 'Sugar Milk', '3'),
    new Roll('Apple', 'Original', '3')
];


function displayCartItems() {
    const container = document.getElementById('cart-items-container');// container element where cart items will be
    const template = document.getElementById('cart-item-template');//template for a cart item to clone for each item in the cart


    //clear the container to remove any previous cart items
    container.innerHTML = ''; 
    let totalPrice = 0;

    // loop through each item in the cart
    for (let index = 0; index < cart.length; index++) {
        const roll = cart[index];
        const clone = document.importNode(template.content, true);//clone the template for a new cart item
        const itemPrice = (roll.basePrice + roll.glazingPrice) * roll.packMultiplier;//calculate the total price for the current item 

        // setting sources for images , details, price
        clone.querySelector('.cart-item-image').src = `../assets/products/${rolls[roll.type].imageFile}`;
        clone.querySelector('.cart-item-details').innerHTML = `${roll.type} cinnamon roll<br><br>Glazing: ${roll.glazing}<br><br>Pack Size: ${roll.size}`;
        clone.querySelector('.cart-item-price').textContent = `$${itemPrice.toFixed(2)}`;

        clone.querySelector('.cart-order').dataset.index = index;
        // store the index of the item in the dataset for easy reference in event handlers
        const removeButton = clone.querySelector('.remove-button');// get the remove button 
        removeButton.dataset.index = index;//set the index for the remove button

        // Attach event listener to remove button directly
        removeButton.addEventListener('click', function() {
            removeItem(index);  // Call remove function with the correct index
        });

        container.appendChild(clone);
        totalPrice += itemPrice; // add item price to total
    }

    // Update total price
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}

function removeItem(index) {
    cart.splice(index, 1);  //method for removing an item from the cart array
    displayCartItems();     
}

window.onload = function() {
    const glazingDropdown = document.getElementById('glazing'); // select glazing dropdown
    const packSizeDropdown = document.getElementById('packsize'); // select pack size dropdown

    //removeButton.addEventListener('click', function() { removeItem(index); });

    //glazingDropdown.addEventListener('change', updatePrice); // when user changes selected option in dropdown, updatePrice function is called to recalculate using event listener
    //packSizeDropdown.addEventListener('change', updatePrice);
    displayCartItems();
};


