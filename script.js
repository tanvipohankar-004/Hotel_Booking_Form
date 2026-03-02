let selectedRoom = "";
let selectedPrice = 0;
let isDormitory = false;

function selectRoom(name, price, dorm) {
selectedRoom = name;
selectedPrice = price;
isDormitory = dorm;

document.getElementById("roomName").value = name;

document.getElementById("bookingForm").scrollIntoView({
behavior: "smooth"
});

calculateTotal();
}

document.getElementById("checkin").addEventListener("change", calculateTotal);
document.getElementById("checkout").addEventListener("change", calculateTotal);
document.getElementById("adults").addEventListener("input", calculateTotal);
document.getElementById("children").addEventListener("input", calculateTotal);

function calculateTotal() {

const checkin = document.getElementById("checkin").value;
const checkout = document.getElementById("checkout").value;
const adults = parseInt(document.getElementById("adults").value) || 0;
const children = parseInt(document.getElementById("children").value) || 0;

if (!checkin || !checkout || !selectedRoom) {
document.getElementById("totalDisplay").innerText = "Total: ₹0";
return;
}

const nights = (new Date(checkout) - new Date(checkin)) / (1000*60*60*24);
if (nights <= 0) {
document.getElementById("totalDisplay").innerText = "Total: ₹0";
return;
}

let total = 0;

if (isDormitory) {
total = selectedPrice * nights * (adults + children);
} else {
total = selectedPrice * nights;
}

document.getElementById("totalDisplay").innerText = "Total: ₹" + total;
}

function processBooking() {

document.getElementById("overlay").style.display = "flex";

setTimeout(() => {
document.querySelector(".loader").style.display = "none";
document.getElementById("processingText").style.display = "none";
document.getElementById("successBox").style.display = "block";
}, 1500);
}

function showReceipt() {

document.getElementById("overlay").style.display = "none";
document.getElementById("receiptModal").style.display = "flex";

document.getElementById("receiptContent").innerHTML = `
<p><strong>Name:</strong> ${fullname.value}</p>
<p><strong>Room:</strong> ${selectedRoom}</p>
<p><strong>${totalDisplay.innerText}</strong></p>
`;
}

function closeReceipt() {
document.getElementById("receiptModal").style.display = "none";
location.reload();
}
