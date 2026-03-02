const form = document.getElementById("bookingForm");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const roomType = document.getElementById("roomType");
const guests = document.getElementById("guests");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const bookingSummary = document.getElementById("bookingSummary");

// Prevent past dates
const today = new Date().toISOString().split("T")[0];
checkin.setAttribute("min", today);
checkout.setAttribute("min", today);

// Update checkout min date dynamically
checkin.addEventListener("change", function () {
    checkout.value = "";
    checkout.setAttribute("min", checkin.value);
});

// Price per night
const roomPrices = {
    Single: 2000,
    Double: 3500,
    Suite: 5000
};

// Calculate nights
function calculateNights(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate - startDate;
    return timeDiff / (1000 * 3600 * 24);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    errorMessage.textContent = "";
    successMessage.textContent = "";
    bookingSummary.textContent = "";

    if (!checkin.value || !checkout.value || !roomType.value || !guests.value) {
        errorMessage.textContent = "Please fill all required fields.";
        return;
    }

    const nights = calculateNights(checkin.value, checkout.value);

    if (nights <= 0) {
        errorMessage.textContent = "Check-out date must be after check-in date.";
        return;
    }

    const totalPrice = nights * roomPrices[roomType.value];

    bookingSummary.innerHTML = `
        <strong>Booking Summary:</strong><br>
        Room Type: ${roomType.value}<br>
        Guests: ${guests.value}<br>
        Nights: ${nights}<br>
        Total Price: ₹${totalPrice}
    `;

    successMessage.textContent = "Booking successful!";
});
