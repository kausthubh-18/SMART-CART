/* ---------- RFID PRODUCT DATABASE ---------- */
const productDB = {
    "RFID001": { name: "Salt", price: 70, weight: "500g", img: "salt.jpg" },
    "RFID002": { name: "Tomato", price: 30, weight: "1kg", img: "tomato.jpg" },
    "RFID003": { name: "Jeera", price: 50, weight: "100g", img: "jeera.jpg" },
    "RFID004": { name: "Cumin powder", price: 70, weight: "50g", img: "cumin.webp" }
};

/* ---------- ON LOAD ---------- */
window.onload = function () {
    updateCart();
};

/* ---------- MAIN CART UPDATE ---------- */
function updateCart() {
    reindexSerialNumbers(); 
    calculateGrandTotal();
    generateQR();
}
/* ---------- SIMULATED WEIGHT SENSOR ---------- */
function getMeasuredWeight() {
    // simulate sensor value (grams)
    return Math.floor(Math.random() * 2000); 
}

/* ---------- HANDLE RFID SCAN ---------- */
function handleRFID(tagId) {
    let product = productDB[tagId];
    if (!product) return;

    let rows = document.querySelectorAll("table tr");
    let foundRow = null;

    rows.forEach((row, index) => {
        if (index > 0 && index < rows.length - 1) {
            if (row.cells[1].textContent.trim() === product.name) {
                foundRow = row;
            }
        }
    });

    if (foundRow) {
        foundRow.remove();     // 🔁 remove if scanned again
    } else {
        addProductToCart(product); // ➕ add if not present
    }

    updateCart(); // 🔥 real-time sync
}

/* ---------- ADD PRODUCT TO CART ---------- */
function addProductToCart(product) {
    let table = document.querySelector("table");
    let totalRow = document.querySelector("#grandTotal").closest("tr");

    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>*</td>
        <td>${product.name}</td>
        <td><img src="${product.img}" width="60"></td>
        <td>01</td>
        <td>${product.price}₹</td>
        <td>${product.weight}</td>
        <td>
            <button onclick="removeItem(this)">❌</button>
        </td>
    `;

    table.insertBefore(newRow, totalRow);
}

/* ---------- MANUAL REMOVE ---------- */
function removeItem(button) {
    button.closest("tr").remove();
    updateCart();
}

/* ---------- GRAND TOTAL ---------- */
function calculateGrandTotal() {
    let total = 0;
    let rows = document.querySelectorAll("table tr");

    rows.forEach((row, index) => {
        if (index > 0 && index < rows.length - 1) {
            let price = parseInt(row.cells[4].textContent.replace("₹", ""));
            total += price;
        }
    });

    document.getElementById("grandTotal").textContent = "₹ " + total;
    return total;
}

/* ---------- QR PAYMENT (AUTO UPDATE) ---------- */
function generateQR() {
    let total = calculateGrandTotal();

    if (total === 0) {
        document.getElementById("qrcode").innerHTML = "";
        return;
    }

    let upiURL =
        `upi://pay?pa=store@upi` +
        `&pn=SmartCart` +
        `&am=${total}` +
        `&cu=INR` +
        `&tn=Smart%20Cart%20Purchase`;

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {
        text: upiURL,
        width: 300,
        height: 300
    });
}

/* ---------- STATUS BAR ---------- */
document.getElementById("wifi").textContent = "Wi-Fi: Connected";
document.getElementById("network").textContent = "Net: Online";

if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        function updateBattery() {
            document.getElementById("battery").textContent =
                "🔋 " + Math.round(battery.level * 100) + "%";
        }
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
    });
} else {
    document.getElementById("battery").textContent = "🔋 N/A";
}
/* ---------- AUTO S.NO REINDEX ---------- */
function reindexSerialNumbers() {
    let rows = document.querySelectorAll("table tr");

    let serial = 1;
    rows.forEach((row, index) => {
        // skip header and total row
        if (index > 0 && index < rows.length - 1) {
            row.cells[0].textContent = serial;
            serial++;
        }
    });
}
