/* ---------- PRODUCT DATABASE (RFID → ITEM) ---------- */
const productDB = {
    "RFID001": { name: "Salt", price: 70, weight: "500g", img: "salt.jpg" },
    "RFID002": { name: "Tomato", price: 30, weight: "1kg", img: "tomato.jpg" },
    "RFID003": { name: "Jeera", price: 50, weight: "100g", img: "jeera.jpg" },
    "RFID004": { name: "Cumin powder", price: 70, weight: "50g", img: "cumin.webp" }
};

/* ---------- ON LOAD ---------- */
window.addEventListener("load", updateCart);

/* ---------- HANDLE RFID SCAN ---------- */
function handleRFID(tagId) {
    const product = productDB[tagId];
    if (!product) return;

    const table = document.querySelector("table");
    const totalRow = document.getElementById("totalRow");

    let existingRow = [...table.rows].find(
        row => row.cells[1]?.textContent === product.name
    );

    if (existingRow) {
        existingRow.remove();   // remove on rescan
    } else {
        addRow(product, table, totalRow); // add on scan
    }

    updateCart();
}

/* ---------- ADD ROW ---------- */
function addRow(product, table, totalRow) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td></td>
        <td>${product.name}</td>
        <td><img src="${product.img}" width="60"></td>
        <td>01</td>
        <td>${product.price}₹</td>
        <td>${product.weight}</td>
        <td><button onclick="removeItem(this)">❌</button></td>
    `;

    table.insertBefore(row, totalRow);
}

/* ---------- MANUAL REMOVE ---------- */
function removeItem(btn) {
    btn.closest("tr").remove();
    updateCart();
}

/* ---------- UPDATE CART ---------- */
function updateCart() {
    reindexSerial();
    updateTotal();
    updateQR();
}

/* ---------- S.NO REINDEX ---------- */
function reindexSerial() {
    let count = 1;
    document.querySelectorAll("table tr").forEach((row, i) => {
        if (row.cells.length && row.id !== "totalRow" && i !== 0) {
            row.cells[0].textContent = count++;
        }
    });
}

/* ---------- GRAND TOTAL ---------- */
function updateTotal() {
    let total = 0;

    document.querySelectorAll("table tr").forEach(row => {
        // ❌ Skip header row and Grand Total row
        if (!row.cells[4] || row.id === "totalRow") return;

        let priceText = row.cells[4].textContent.replace("₹", "").trim();
        let price = parseInt(priceText);

        if (!isNaN(price)) {
            total += price;
        }
    });

    document.getElementById("grandTotal").textContent = "₹ " + total;
    return total;
}


/* ---------- QR AUTO UPDATE (CRISP) ---------- */
function updateQR() {
    const total = updateTotal();
    const qr = document.getElementById("qrcode");

    qr.innerHTML = "";

    if (!total || isNaN(total) || total <= 0) return;

    new QRCode(qr, {
        text: `upi://pay?pa=store@upi&pn=SmartCart&am=${total}&cu=INR`,
        width: 360,
        height: 360,
        correctLevel: QRCode.CorrectLevel.H
    });
}
