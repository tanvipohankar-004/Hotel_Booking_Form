let selectedPrice = 0;
let selectedCapacity = 0;
let isDorm = false;

function selectRoom(name, price, capacity, dorm) {
    selectedPrice = price;
    selectedCapacity = capacity;
    isDorm = dorm;

    document.getElementById("roomName").value = name;
    document.getElementById("bookingForm").scrollIntoView({behavior:"smooth"});
}

document.querySelectorAll("#checkin,#checkout,#adults,#children")
.forEach(el => el.addEventListener("input", calculateTotal));

function calculateTotal(){
    const checkin = new Date(document.getElementById("checkin").value);
    const checkout = new Date(document.getElementById("checkout").value);
    const adults = parseInt(document.getElementById("adults").value) || 0;
    const children = parseInt(document.getElementById("children").value) || 0;

    const guests = adults + children;

    if(guests > selectedCapacity){
        alert("Guest limit exceeded for this room.");
        return;
    }

    const nights = (checkout - checkin)/(1000*60*60*24);

    if(nights > 0){
        let total = isDorm ? (selectedPrice * guests * nights)
                           : (selectedPrice * nights);

        document.getElementById("totalDisplay").innerText =
            `Total (${nights} nights): ₹${total}`;
    }
}

function processBooking(){
    document.getElementById("overlay").style.display="flex";

    setTimeout(()=>{
        document.querySelector(".loader").style.display="none";
        document.getElementById("successBox").style.display="block";
    },1500);
}

function showReceipt(){
    const bookingId = "RS" + Math.floor(Math.random()*100000);
    const room = document.getElementById("roomName").value;
    const total = document.getElementById("totalDisplay").innerText;
    const name = document.getElementById("fullname").value;

    document.getElementById("receiptContent").innerHTML = `
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Room:</strong> ${room}</p>
        <p>${total}</p>
        <p>Status: Confirmed</p>
    `;

    document.getElementById("receiptModal").style.display="flex";
}

function closeReceipt(){
    document.getElementById("receiptModal").style.display="none";
    location.reload();
}
