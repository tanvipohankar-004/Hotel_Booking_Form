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
    selectedPrice = Number(price); 
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

    // show processing state
    document.querySelector(".loader").style.display = "block";
    document.getElementById("processingText").style.display = "block";
    document.getElementById("successBox").style.display = "none";

    // processing delay 1.5 seconds
    setTimeout(() => {

        // hide processing
        document.querySelector(".loader").style.display = "none";
        document.getElementById("processingText").style.display = "none";

        // show success
        document.getElementById("successBox").style.display = "block";

    }, 1500);
}

// =room and booking id generator

function generateRoomAndBookingId() {

    const name = document.getElementById("fullName").value.trim() || "GUEST";

    const prefix = name.substring(0, 4).toUpperCase();
    generatedRoomNumber = Math.floor(100 + Math.random() * 900);
    generatedBookingId = prefix + generatedRoomNumber;
}

// reciept

function showReceipt(){

document.getElementById("overlay").style.display="none";
document.getElementById("receiptModal").style.display="flex";

document.getElementById("rName").innerText=document.getElementById("fullName").value;
document.getElementById("rRoom").innerText=selectedRoom;
document.getElementById("rRoomNo").innerText=generatedRoomNumber;
document.getElementById("rBookingId").innerText=generatedBookingId;
document.getElementById("rCheckIn").innerText=checkinInput.value;
document.getElementById("rCheckOut").innerText=checkoutInput.value;
document.getElementById("rNights").innerText=totalNights;
document.getElementById("rTotal").innerText="₹"+calculatedTotal;

}
function closeReceipt() {
    document.getElementById("receiptModal").style.display = "none";
    location.reload();
}
