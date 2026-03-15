let cart = [];
const phoneNumber = "+254755325194"; // REPLACE WITH YOUR NUMBER

function addToCart(title, price) {
    cart.push({ title, price });
    updateUI();
    toggleCart(true);
}

function updateUI() {
    const list = document.getElementById('cart-items-list');
    const subtotalDisplay = document.getElementById('subtotal');
    let total = 0;
    list.innerHTML = '';

    cart.forEach((item, i) => {
        total += item.price;
        list.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:5px;">
                <span>${item.title}</span>
                <span>Ksh ${item.price.toLocaleString()}</span>
                <button onclick="remove(${i})" style="background:none; color:red; border:none; cursor:pointer;">X</button>
            </div>`;
    });

    document.getElementById('cart-count').innerText = cart.length;
    subtotalDisplay.innerText = `Ksh ${total.toLocaleString()}`;
}

function remove(i) {
    cart.splice(i, 1);
    updateUI();
}

function toggleCart(show) {
    document.getElementById('cart-sidebar').classList.toggle('open', show);
    document.getElementById('cart-overlay').style.display = show ? 'block' : 'none';
}

function sendToWhatsApp() {
    if (cart.length === 0) return alert("Archive is empty!");

    const customization = document.getElementById('custom-req').value;
    const total = document.getElementById('subtotal').innerText;
    
    // Build Item List
    let itemsString = cart.map(item => `- ${item.title} (Ksh ${item.price})`).join('%0A');
    
    // Construct Message
    let message = `*URBAN ARCHIVE ORDER*%0A%0A` +
                  `*Items:*%0A${itemsString}%0A%0A` +
                  `*Total:* ${total}%0A` +
                  `*Customization:* ${customization || "None"}%0A%0A` +
                  `Please let me know how to proceed with the payment.`;

    // WhatsApp API URL (Universal Link format)
    const whatsappUrl = `https://wa.me{+254755325194}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
}














const container = document.getElementById('reviewContainer');
const revForm = document.getElementById('revForm');
const photoInput = document.getElementById('revPhoto');
const fileNameDisplay = document.getElementById('fileName');

// Update file name UI
photoInput.onchange = () => { fileNameDisplay.innerText = photoInput.files[0].name; };

// Load user-added reviews from Storage
window.onload = () => {
    const userReviews = JSON.parse(localStorage.getItem('cova_custom_reviews')) || [];
    userReviews.forEach(rev => displayReview(rev));
};

function displayReview(data) {
    const starStr = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
    const div = document.createElement('div');
    div.className = 'review-item glass-card';
    div.innerHTML = `
        <div class="stars">${starStr}</div>
        ${data.photo ? `<img src="${data.photo}" class="review-img">` : ''}
        <strong>${data.name}</strong>
        <p>"${data.text}"</p>
    `;
    container.prepend(div);
}

revForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const name = document.getElementById('revName').value.toUpperCase();
    const text = document.getElementById('revText').value;
    
    let photoBase64 = "";
    if (photoInput.files[0]) {
        photoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(photoInput.files[0]);
        });
    }

    const reviewObj = { name, text, rating: parseInt(rating), photo: photoBase64 };
    
    // Save to LocalStorage
    const stored = JSON.parse(localStorage.getItem('cova_custom_reviews')) || [];
    stored.push(reviewObj);
    localStorage.setItem('cova_custom_reviews', JSON.stringify(stored));

    displayReview(reviewObj);
    revForm.reset();
    fileNameDisplay.innerText = "";
    alert("FIT UPLOADED TO THE STATE OF ETERNITY.");
};
