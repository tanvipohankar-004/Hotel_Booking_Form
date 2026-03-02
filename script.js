const roomCards = document.querySelectorAll(".room-card");
const selectedRoom = document.getElementById("selectedRoom");
const roomPrice = document.getElementById("roomPrice");
const roomCapacity = document.getElementById("roomCapacity");

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const adults = document.getElementById("adults");
const children = document.getElementById("children");
const form = document.getElementById("bookingForm");
const message = document.getElementById("message");
const priceSummary = document.getElementById("priceSummary");

const modal = document.getElementById("receiptModal");
const receiptContent = document.getElementById("receiptContent");
const closeModal = document.getElementById("closeModal");

const today = new Date().toISOString().split("T")[0];
checkin.min = today;
checkout.min = today;

checkin.addEventListener("change", () => {
checkout.value = "";
checkout.min = checkin.value;
});

roomCards.forEach(card => {
card.addEventListener("click", () => {
roomCards.forEach(c => c.classList.remove("selected"));
card.classList.add("selected");

selectedRoom.value = card.dataset.room;
roomPrice.value = card.dataset.price;
roomCapacity.value = card.dataset.capacity;
});
});

function calculateNights(start, end) {
return (new Date(end) - new Date(start)) / (1000*3600*24);
}

form.addEventListener("submit", function(e){
e.preventDefault();
message.innerHTML = "";

if(!selectedRoom.value){
message.innerHTML = "Please select a room.";
return;
}

const totalGuests = Number(adults.value) + Number(children.value || 0);
const capacity = Number(roomCapacity.value);

if(selectedRoom.value !== "Dormitory (Per Bed)" && totalGuests > capacity){
message.innerHTML = "Guest count exceeds room capacity.";
return;
}

const nights = calculateNights(checkin.value, checkout.value);
if(nights <= 0){
message.innerHTML = "Check-out must be after check-in.";
return;
}

const pricePerNight = Number(roomPrice.value);
const totalPrice = selectedRoom.value === "Dormitory (Per Bed)"
? nights * pricePerNight * totalGuests
: nights * pricePerNight;

priceSummary.innerHTML = `
<strong>Total Nights:</strong> ${nights}<br>
<strong>Total Guests:</strong> ${totalGuests}<br>
<strong>Total Price:</strong> ₹${totalPrice}
`;

message.innerHTML = "Processing booking...";

setTimeout(() => {

message.innerHTML = "✔ Booking Successful!";

modal.style.display = "block";

receiptContent.innerHTML = `
<p><strong>Booking ID:</strong> HB${Math.floor(Math.random()*100000)}</p>
<p><strong>Name:</strong> ${document.getElementById("name").value}</p>
<p><strong>Room:</strong> ${selectedRoom.value}</p>
<p><strong>Guests:</strong> ${totalGuests}</p>
<p><strong>Check-in:</strong> ${checkin.value}</p>
<p><strong>Check-out:</strong> ${checkout.value}</p>
<p><strong>Total Amount:</strong> ₹${totalPrice}</p>
`;

},2000);

});

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
if(e.target == modal){
modal.style.display = "none";
}
};
