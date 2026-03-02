let selectedRoom = "";
let selectedPrice = 0;
let isDormitory = false;
let generatedRoomNumber = "";
let generatedBookingId = "";
// room selection logic :
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

// date control
const today = new Date().toISOString().split("T")[0];
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

checkinInput.min = today;

// When checkin changes - updating checkout dates
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
    }

    calculateTotal();
});

//price calculation for billing
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

//booking processing 
function processBooking() {

    if (!selectedRoom) {
        alert("Please select a room.");
        return;
    }

    if (!checkinInput.value || !checkoutInput.value) {
        alert("Please select valid dates.");
        return;
    }

    generateRoomAndBookingId();

    document.getElementById("overlay").style.display = "flex";

    setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
        document.getElementById("processingText").style.display = "none";
        document.getElementById("successBox").style.display = "block";
    }, 1200);
}

// room and booking id generation
function generateRoomAndBookingId() {

    const name = document.getElementById("fullname").value.trim();
    const prefix = name.substring(0, 4).toUpperCase();

    generatedRoomNumber = Math.floor(100 + Math.random() * 900); // 3 digit room
    generatedBookingId = prefix + generatedRoomNumber;
}

//generating reciept after successful booking
function showReceipt() {

    document.getElementById("overlay").style.display = "none";
    document.getElementById("receiptModal").style.display = "flex";

    const name = document.getElementById("fullname").value || "N/A";
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
            <p>Booking ID: <strong>${generatedBookingId}</strong></p>
            <p>Room No: <strong>${generatedRoomNumber}</strong></p>
        </div>
        <hr>
        <div class="receipt-body">
            <p><strong>Room Holder:</strong> ${name}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>City/Address:</strong> ${address}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <hr>
            <p><strong>Room Type:</strong> ${selectedRoom}</p>
            <p><strong>Adults:</strong> ${adults}</p>
            <p><strong>Children:</strong> ${children}</p>
            <p><strong>Check-in:</strong> ${checkin}</p>
            <p><strong>Check-out:</strong> ${checkout}</p>
            <hr>
            <h3>${total}</h3>
        </div>
    `;
}

function closeReceipt() {
    document.getElementById("receiptModal").style.display = "none";
    location.reload();
}
