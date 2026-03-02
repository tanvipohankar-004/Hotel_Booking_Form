let selectedRoom = "";
let selectedPrice = 0;
let isDormitory = false;
let generatedRoomNumber = "";
let generatedBookingId = "";
// room selection 

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

// date

const today = new Date().toISOString().split("T")[0];

const checkinInput = document.getElementById("checkIn");
const checkoutInput = document.getElementById("checkOut");

checkinInput.min = today;

checkinInput.addEventListener("change", function () {

    if (checkinInput.value) {
        checkoutInput.min = checkinInput.value;

        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
            checkoutInput.value = "";
        }
    }

    calculateTotal();
});

checkoutInput.addEventListener("change", function () {

    if (checkoutInput.value <= checkinInput.value) {
        alert("Checkout date must be after Check-in date.");
        checkoutInput.value = "";
        return;
    }

    calculateTotal();
});

// price calculator
document.getElementById("adults").addEventListener("input", calculateTotal);
document.getElementById("children").addEventListener("input", calculateTotal);

function calculateTotal() {

    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const adults = parseInt(document.getElementById("adults").value) || 0;
    const children = parseInt(document.getElementById("children").value) || 0;

    if (!checkin || !checkout || !selectedRoom) {
        document.getElementById("totalDisplay").innerText = "Total: ₹0";
        return;
    }

    const nights = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24);

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

// Booking process

function processBooking() {

    const name = document.getElementById("fullName").value.trim();

    if (!selectedRoom) {
        alert("Please select a room.");
        return;
    }

    if (!checkinInput.value || !checkoutInput.value) {
        alert("Please select valid dates.");
        return;
    }

    if (checkoutInput.value <= checkinInput.value) {
        alert("Checkout date must be after Check-in date.");
        return;
    }

    if (name.length < 3) {
        alert("Please enter valid full name.");
        return;
    }

    generateRoomAndBookingId();

    document.getElementById("overlay").style.display = "flex";

    setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
        document.getElementById("processingText").style.display = "none";
        document.getElementById("successBox").style.display = "block";
    }, 1000);
}

// booking id

function generateRoomAndBookingId() {

    const name = document.getElementById("fullName").value.trim();

    const prefix = name.substring(0, 4).toUpperCase();

    generatedRoomNumber = Math.floor(100 + Math.random() * 900);
    generatedBookingId = prefix + generatedRoomNumber;
}

// Generate reciept

function showReceipt() {

    document.getElementById("overlay").style.display = "none";
    document.getElementById("receiptModal").style.display = "flex";

    const name = document.getElementById("fullName").value || "N/A";
    const gender = document.getElementById("gender").value || "N/A";
    const email = document.getElementById("email").value || "N/A";
    const contact = document.getElementById("contact").value || "N/A";
    const address = document.getElementById("address").value || "N/A";

    const adults = document.getElementById("adults").value || 0;
    const children = document.getElementById("children").value || 0;

    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;

    const total = document.getElementById("totalDisplay").innerText;

    document.getElementById("receiptContent").innerHTML = `
        <div class="receipt-header">
            <h2>ROYAL STAY BOOKING</h2>
            <div class="receipt-subtitle">Luxury Hotel Reservation Receipt</div>
        </div>

        <div class="receipt-section">
            <h4>Guest Details</h4>
            <div class="receipt-row"><span>Name</span><span>${name}</span></div>
            <div class="receipt-row"><span>Gender</span><span>${gender}</span></div>
            <div class="receipt-row"><span>Address</span><span>${address}</span></div>
            <div class="receipt-row"><span>Email</span><span>${email}</span></div>
            <div class="receipt-row"><span>Contact</span><span>${contact}</span></div>
        </div>

        <div class="receipt-section">
            <h4>Booking Details</h4>
            <div class="receipt-row"><span>Room Type</span><span>${selectedRoom}</span></div>
            <div class="receipt-row"><span>Room Number</span><span>${generatedRoomNumber}</span></div>
            <div class="receipt-row"><span>Booking ID</span><span>${generatedBookingId}</span></div>
            <div class="receipt-row"><span>Adults</span><span>${adults}</span></div>
            <div class="receipt-row"><span>Children</span><span>${children}</span></div>
            <div class="receipt-row"><span>Check-in</span><span>${checkin}</span></div>
            <div class="receipt-row"><span>Check-out</span><span>${checkout}</span></div>
        </div>

        <div class="receipt-total">
            <span>Total Amount</span>
            <span>${total}</span>
        </div>

        <div class="receipt-footer">
            Thank you for choosing Royal Stay. We wish you a pleasant stay!
        </div>
    `;
}

function closeReceipt() {
    document.getElementById("receiptModal").style.display = "none";
    location.reload();
}
