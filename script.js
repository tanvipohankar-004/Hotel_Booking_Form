let selectedPrice = 0;
let selectedCapacity = 0;
let isDorm = false;

function selectRoom(name, price, capacity, dorm, btn){
selectedPrice = price;
selectedCapacity = capacity;
isDorm = dorm;

document.getElementById("roomName").value = name;

document.querySelectorAll(".card").forEach(c=>c.classList.remove("selected"));
btn.parentElement.classList.add("selected");

clearErrors();

document.getElementById("bookingForm")
.scrollIntoView({behavior:"smooth"});

calculateTotal();
}

let today = new Date().toISOString().split("T")[0];
checkin.min = today;
checkout.min = today;

document.querySelectorAll("#checkin,#checkout,#adults,#children")
.forEach(el=>el.addEventListener("input",calculateTotal));

function calculateTotal(){

if(!selectedPrice) return;

let checkinVal = checkin.value;
let checkoutVal = checkout.value;
let adults = parseInt(adultsInput.value)||0;
let children = parseInt(childrenInput.value)||0;

let guests = adults + children;

if(guests > selectedCapacity){
totalDisplay.innerText="Guest limit exceeded for this room.";
return;
}

if(checkinVal && checkoutVal){
let nights=(new Date(checkoutVal)-new Date(checkinVal))/(1000*60*60*24);

if(nights>0){
let total=isDorm?selectedPrice*guests*nights:selectedPrice*nights;
totalDisplay.innerText=`Total (${nights} nights): ₹${total}`;
}else{
totalDisplay.innerText="Check-out must be after check-in.";
}
}
}

function processBooking(){

clearErrors();
let valid=true;

if(!roomName.value){
showError("roomError","Please select a room.");
valid=false;
}

if(!checkin.value){
showError("checkinError","Check-in required.");
valid=false;
}

if(!checkout.value){
showError("checkoutError","Check-out required.");
valid=false;
}

if(!fullname.value.trim()){
showError("nameError","Full name required.");
valid=false;
}

if(!valid) return;

overlay.style.display="flex";

setTimeout(()=>{
loader.style.display="none";
processingText.style.display="none";
successBox.style.display="block";
},1500);
}

function showError(id,msg){
document.getElementById(id).innerText=msg;
}

function clearErrors(){
document.querySelectorAll(".error").forEach(e=>e.innerText="");
}

function showReceipt(){

let bookingId="RS"+Math.floor(Math.random()*100000);
let content=`
<p><strong>Booking ID:</strong> ${bookingId}</p>
<p><strong>Name:</strong> ${fullname.value}</p>
<p><strong>Room:</strong> ${roomName.value}</p>
<p><strong>Stay:</strong> ${checkin.value} to ${checkout.value}</p>
<p><strong>Guests:</strong> ${adultsInput.value} Adults, ${childrenInput.value} Children</p>
<p><strong>Special Request:</strong> ${requests.value || "None"}</p>
<p>${totalDisplay.innerText}</p>
<p>Status: Confirmed</p>
`;

receiptContent.innerHTML=content;
receiptModal.style.display="flex";
}

function closeReceipt(){
location.reload();
}
