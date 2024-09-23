

const glazingType = {// dictionary that contains types of glazing and additional prices for each option
  "original": 0.00,
  "sugar-milk": 0.00,
  "vanilla-milk": 0.50,
  "double-chocolate": 1.50
};

const packSizes = { "1": 1, "3": 3, "6": 5, "12": 10};//dictionary for pack size and multiplier value 

const basePrice = 2.49;// base price of the cinnamon roll


//Functions//

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
  const glazingPrice= document.getElementById('glazing').value;// gets the numerical value of the selected option in the glazing dropdown
  const packMultiplier= document.getElementById('packsize').value;// gets the pack size multiplier from the packsize dropdown
  let total= (basePrice + glazingPrice ) * packMultiplier;// computes the total price by adding base price to glazing price, and then using multiplier
  document.querySelector('.price-cart h3').textContent = `$${total.toFixed(2)}`;// selects html element and modifys what is in h3 using .textContent. toFixed formats total to two decimal places, and dollar sign is included using $${}
}


const glazingDropdown = document.getElementById('glazing');
const packSizeDropdown= document.getElementById('packsize');

//event listeners
glazingDropdown.addEventListener('change', updatePrice);// when user changes selected option in dropdown, updatePrice function is called to recalculate using event listener
packSizeDropdown.addEventListener('change', updatePrice);


