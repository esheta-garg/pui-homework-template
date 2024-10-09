
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

let cart = [];


const glazingType = {// dictionary that contains types of glazing and additional prices for each option
  "original": 0.00,
  "sugar milk": 0.00,
  "vanilla milk": 0.50,
  "double chocolate": 1.50
};

const packSizes = { "1": 1, "3": 3, "6": 5, "12": 10};//dictionary for pack size and multiplier value 


const queryString = window.location.search;// gets the url query atring
const params = new URLSearchParams(queryString);//parses the quer string
const rollType = params.get("rolls");//assigns it to roll type
const currentRolldata = rolls[rollType];// get the roll data using RollType, such as baseprice and image file

let basePrice = currentRolldata?.basePrice || 0;// base price  of the rolls 

const rollsName = rollType + " " + "Cinnamon Roll";
const rollsImage = "../assets/products/" + currentRolldata.imageFile;  // image path updates for each roll, access using currentRolldata
const rollsPrice = currentRolldata.basePrice;  // sets the base price


class Roll {// saves all of current product information into the instance of class Roll
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
}

//function//

function dropdowns() {
  const glazingDropdown = document.getElementById('glazing');//selects HTML element 'glazing', stores in variable glazingDropdown
  const packSizeDropdown = document.getElementById('packsize');//selects HTML element 'packsize', stores in variable packSizeDropdown

  for (let glazing in glazingType) {// for loop to iteratre thru the glazingType, 'glazing' takes the name of glazing option
    const option= document.createElement('option');// creates a new <option> element for the select dropdwon
    option.value = glazingType[glazing];// assigns the dict value for <option> based on glazing type
    option.textContent= glazing; //displays the name of the glazing
    glazingDropdown.appendChild(option);// adds option to the dropdown
  }

  for (let size in packSizes) {
    const option = document.createElement('option');
    option.value= packSizes[size];//  assigns value for <option> to the pack multiplier 
    option.textContent = size; //controls what the user sees in the dropdown. dropdown will show size number 
    packSizeDropdown.appendChild(option);// adds option to the droopdwon 
  }
}

function updatePrice(){
  const glazingPrice= parseFloat(document.getElementById('glazing').value);// gets the numerical value of the selected option in the glazing dropdown
  const packMultiplier= parseFloat(document.getElementById('packsize').value);// gets the pack size multiplier from the packsize dropdown
  let total= (basePrice + glazingPrice ) * packMultiplier;// computes the total price by adding base price to glazing price, and then using multiplier

  document.querySelector('#price').textContent = `$${total.toFixed(2)}`;// selects html element and modifys what is in h3 using .textContent. toFixed formats total to two decimal places, and dollar sign is included using $${}

}


function addToCart() {
  const glazing = document.getElementById('glazing').value;//gets the glazing option
  const packSize = document.getElementById('packsize').value;// gets the pack size option
  const updatedRoll = new Roll(rollType, glazing, packSize, basePrice);// creates a new object using class Roll, which can be customized with the user's actions
  cart.push(updatedRoll);//pushes this new roll into the cart array 
  console.log(cart);// prints current state of cart
}






//CART ITEMS//


function addItemToCart(rollType, glazing, packSize, basePrice) {
  const newRoll = new Roll(rollType, glazing, packSize, basePrice);
  cart.push(newRoll);
  updateCartDisplay();
}





window.onload = function () {// event that occurs when the webpage has finished loading

  document.querySelector('h1').textContent = rollsName;//changes the text inside that <h1> to the text stored in rollsName
  document.querySelector('#detail-image').src = rollsImage; // changes the image in the product detail page to that stored in rollsImage
  document.querySelector('#price').innerHTML= `$${rollsPrice.toFixed(2)}`;//changes the price in on the page, updates dynamically 

  const glazingDropdown = document.getElementById('glazing');
  const packSizeDropdown= document.getElementById('packsize');  

  //event listeners
  glazingDropdown.addEventListener('change', updatePrice);// when user changes selected option in dropdown, updatePrice function is called to recalculate using event listener
  packSizeDropdown.addEventListener('change', updatePrice);


  //const addToCartButton = document.getElementById('addToCartButton');
  dropdowns(); //function is called once the web has loaded
  updatePrice();

}



