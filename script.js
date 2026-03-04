//global var

let selectedRoom = "";
let selectedPrice = 0;
let isDormitory = false;

let generatedRoomNumber = "";
let generatedBookingId = "";

let calculatedTotal = 0;
let totalNights = 0;

// select room

function selectRoom(name, price, dorm) {
    selectedRoom = name;
    selectedPrice = Number(price); // ensure number
    isDormitory = dorm;

    document.getElementById("roomName").value = name;

    document.getElementById("bookingForm").scrollIntoView({
        behavior: "smooth"
    });

    calculateTotal();
}

// date validation

const checkinInput = document.getElementById("checkIn");
const checkoutInput = document.getElementById("checkOut");

// disable past dates
const today = new Date();
today.setHours(0, 0, 0, 0);
checkinInput.min = today.toISOString().split("T")[0];

checkinInput.addEventListener("change", function () {

    if (checkinInput.value) {

        const checkinDate = new Date(checkinInput.value);

        checkinDate.setDate(checkinDate.getDate() + 1);
        checkoutInput.min = checkinDate.toISOString().split("T")[0];

        if (checkoutInput.value &&
            new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
            checkoutInput.value = "";
        }
    }

    calculateTotal();
});

checkoutInput.addEventListener("change", calculateTotal);
document.getElementById("adults").addEventListener("input", calculateTotal);
document.getElementById("children").addEventListener("input", calculateTotal);

// price calculation

function calculateTotal() {

    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const adults = parseInt(document.getElementById("adults").value) || 0;
    const children = parseInt(document.getElementById("children").value) || 0;

    const totalDisplay = document.getElementById("totalDisplay");

    if (!checkin || !checkout || !selectedRoom) {
        totalDisplay.innerText = "Total: ₹0";
        calculatedTotal = 0;
        totalNights = 0;
        return;
    }

    const checkinDate = new Date(checkin + "T00:00:00");
    const checkoutDate = new Date(checkout + "T00:00:00");

  // per night price calculations
    const diffTime = checkoutDate - checkinDate;
    const nights = diffTime / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
        totalDisplay.innerText = "Total: ₹0";
        calculatedTotal = 0;
        totalNights = 0;
        return;
    }

    totalNights = nights;

    let total = 0;

    if (isDormitory) {
        const totalGuests = adults + children;
        total = selectedPrice * nights * totalGuests;
    } else {
        total = selectedPrice * nights; 
    }

    calculatedTotal = total;
    totalDisplay.innerText = `Total: ₹${total}`;
}

// booking process

function processBooking() {

    const form = document.getElementById("bookingForm"); 

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (!selectedRoom) {
        alert("Please select a room.");
        return;
    }

    if (calculatedTotal === 0) {
        alert("Please select valid dates.");
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

// =room and booking id generator

function generateRoomAndBookingId() {

    const name = document.getElementById("fullName").value.trim() || "GUEST";

    const prefix = name.substring(0, 4).toUpperCase();
    generatedRoomNumber = Math.floor(100 + Math.random() * 900);
    generatedBookingId = prefix + generatedRoomNumber;
}

// reciept

function showReceipt() {

    document.getElementById("overlay").style.display = "none";
    document.getElementById("receiptModal").style.display = "flex";

    const name = document.getElementById("fullName").value || "N/A";
    const gender = document.getElementById("gender").value || "N/A";
    const email = document.getElementById("email").value || "N/A";
    const contact = document.getElementById("contact").value || "N/A";
    const address = document.getElementById("address").value || "N/A";
    const requests = document.getElementById("requests").value || "None";

    const adults = document.getElementById("adults").value || 0;
    const children = document.getElementById("children").value || 0;

    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;

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
            <div class="receipt-row"><span>Special Requests</span><span>${requests}</span></div>
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
            <div class="receipt-row"><span>Nights</span><span>${totalNights}</span></div>
        </div>

        <div class="receipt-total">
            <span>Total Amount</span>
            <span>₹${calculatedTotal}</span>
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
