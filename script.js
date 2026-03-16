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

    let enteredNumber = document.getElementById('whatsapp-number')?.value || phoneNumber;
    enteredNumber = enteredNumber.trim();
    if (!enteredNumber) enteredNumber = phoneNumber;

    const cleanPhone = enteredNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
        return alert('Invalid phone number. Use international format like +254722123456 or 254722123456.');
    }

    document.getElementById('support-number').innerText = `+${cleanPhone}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}














const container = document.getElementById('reviewContainer');
const revForm = document.getElementById('revForm');
const photoInput = document.getElementById('revPhoto');
const fileNameDisplay = document.getElementById('fileName');

// Load user-added reviews from Storage safely on pages with review form
if (container) {
    const userReviews = JSON.parse(localStorage.getItem('cova_custom_reviews')) || [];
    userReviews.forEach(rev => displayReview(rev));
}

function displayReview(data) {
    if (!container) return;
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

if (photoInput && fileNameDisplay) {
    photoInput.onchange = () => {
        const file = photoInput.files[0];
        fileNameDisplay.innerText = file ? file.name : '';
    };
}

if (revForm) {
    revForm.onsubmit = async (e) => {
        e.preventDefault();

        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const nameInput = document.getElementById('revName');
        const textInput = document.getElementById('revText');

        const rating = ratingInput ? ratingInput.value : '5';
        const name = nameInput ? nameInput.value.toUpperCase() : 'ANONYMOUS';
        const text = textInput ? textInput.value : '';

        let photoBase64 = "";
        if (photoInput && photoInput.files[0]) {
            photoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(photoInput.files[0]);
            });
        }

        const reviewObj = { name, text, rating: parseInt(rating), photo: photoBase64 };

        const stored = JSON.parse(localStorage.getItem('cova_custom_reviews')) || [];
        stored.push(reviewObj);
        localStorage.setItem('cova_custom_reviews', JSON.stringify(stored));

        displayReview(reviewObj);
        revForm.reset();
        if (fileNameDisplay) fileNameDisplay.innerText = "";
        alert("FIT UPLOADED TO THE STATE OF ETERNITY.");
    };
}
