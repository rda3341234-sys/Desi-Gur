// Complete JavaScript for Desi Mithas Gur Website

// WhatsApp Configuration - YOUR INFORMATION
const WHATSAPP_NUMBER = "923494765335"; // Your WhatsApp number
const BUSINESS_EMAIL = "Hassamrana3566@gmail.com"; // Your email
const BUSINESS_NAME = "Desi Mithas";

// Product Information
const PRODUCTS = {
    "500gm": {
        id: "500gm",
        name: "Desi Mithas Gur - 500gm Pack",
        price: 349,
        image: "images/gur-2.jpg",
        description: "Perfect for testing quality or small families. Stay fresh for 6 months.",
        weight: "500 grams",
        shelfLife: "6 Months"
    },
    "1kg": {
        id: "1kg",
        name: "Desi Mithas Gur - 1kg Pack",
        price: 699,
        image: "images/gur-3.jpg",
        description: "Ideal for small families. Best value for money with premium quality.",
        weight: "1 kilogram",
        shelfLife: "6 Months"
    },
    "5kg": {
        id: "5kg",
        name: "Desi Mithas Gur - 5kg Pack",
        price: 3199,
        image: "images/gur-4.jpg",
        description: "Best for large families or regular users. Economical price with premium quality.",
        weight: "5 kilograms",
        shelfLife: "6 Months"
    },
    "custom": {
        id: "custom",
        name: "Custom Quantity Desi Mithas Gur",
        price: 0,
        image: "images/gur-1.jpg",
        description: "We provide gur in any quantity - from 250gm to bulk wholesale orders.",
        weight: "Flexible",
        shelfLife: "6 Months"
    }
};

// Current order state
let currentOrder = {
    product: PRODUCTS["500gm"],
    quantity: 1,
    customerInfo: {},
    deliveryCharge: 100
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Check which page we're on
    const isOrderPage = window.location.pathname.includes('order.html');
    
    if (isOrderPage) {
        initOrderPage();
    } else {
        initHomePage();
    }
    
    console.log(`${BUSINESS_NAME} Website Loaded Successfully! 🍯`);
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = navLinks.style.display === 'flex';
            
            if (isVisible) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '1.5rem';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                navLinks.style.gap = '1rem';
                navLinks.style.borderTop = '3px solid var(--primary-color)';
                navLinks.style.zIndex = '1000';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        });
    }
}

// Homepage Initialization
function initHomePage() {
    // Add click handlers for "Add to Cart" buttons
    document.querySelectorAll('.btn-order').forEach(button => {
        button.addEventListener('click', function() {
            const productType = this.getAttribute('onclick')?.match(/order\.html\?product=(\w+)/)?.[1] || '500gm';
            addToCart(productType);
        });
    });
    
    // Initialize FAQ accordion if exists
    initFAQ();
}

// Order Page Initialization
function initOrderPage() {
    // Get product from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product') || '500gm';
    
    // Set the selected product
    selectProduct(productParam);
    
    // Initialize form elements
    initFormElements();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Update order summary
    updateOrderSummary();
}

// Select Product
function selectProduct(productType) {
    if (PRODUCTS[productType]) {
        currentOrder.product = PRODUCTS[productType];
        
        // Update product display on order page
        if (document.getElementById('orderProductImage')) {
            document.getElementById('orderProductImage').src = currentOrder.product.image;
            document.getElementById('orderProductName').textContent = currentOrder.product.name;
            document.getElementById('orderProductDesc').textContent = currentOrder.product.description;
            document.getElementById('orderProductPrice').textContent = 
                currentOrder.product.price > 0 ? `Rs. ${currentOrder.product.price}` : 'Contact for Price';
            
            // Update summary
            document.getElementById('summaryProduct').textContent = currentOrder.product.name;
            document.getElementById('summaryUnitPrice').textContent = 
                currentOrder.product.price > 0 ? `Rs. ${currentOrder.product.price}` : 'Contact for Price';
        }
    }
}

// Initialize Form Elements
function initFormElements() {
    // Quantity controls
    const quantityInput = document.getElementById('orderQuantity');
    const minusBtn = document.querySelector('.qty-btn[onclick*="-1"]');
    const plusBtn = document.querySelector('.qty-btn[onclick*="1"]');
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) value = 1;
            if (value > 10) value = 10;
            this.value = value;
            currentOrder.quantity = value;
            updateOrderSummary();
        });
        
        quantityInput.addEventListener('input', function() {
            currentOrder.quantity = parseInt(this.value) || 1;
            updateOrderSummary();
        });
    }
    
    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            changeQuantity(-1);
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            changeQuantity(1);
        });
    }
    
    // Form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder();
        });
    }
    
    // City selection affects delivery charge
    const citySelect = document.getElementById('customerCity');
    if (citySelect) {
        citySelect.addEventListener('change', updateOrderSummary);
    }
}

// Change Quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('orderQuantity');
    if (!quantityInput) return;
    
    let currentValue = parseInt(quantityInput.value) || 1;
    let newValue = currentValue + change;
    
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    quantityInput.value = newValue;
    currentOrder.quantity = newValue;
    updateOrderSummary();
}

// Update Order Summary
function updateOrderSummary() {
    if (!document.getElementById('summarySubtotal')) return;
    
    const subtotal = currentOrder.product.price * currentOrder.quantity;
    const city = document.getElementById('customerCity')?.value || '';
    
    // Calculate delivery charge
    // Free delivery for orders above 2000 in major cities
    const majorCities = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad'];
    const isMajorCity = majorCities.includes(city);
    
    let deliveryCharge = 100;
    if (subtotal > 2000 && isMajorCity) {
        deliveryCharge = 0;
    } else if (subtotal > 5000) {
        deliveryCharge = 0; // Free delivery for large orders anywhere
    }
    
    currentOrder.deliveryCharge = deliveryCharge;
    const total = subtotal + deliveryCharge;
    
    // Update summary display
    document.getElementById('summaryQuantity').textContent = currentOrder.quantity;
    document.getElementById('summarySubtotal').textContent = 
        currentOrder.product.price > 0 ? `Rs. ${subtotal}` : 'Contact for Price';
    document.getElementById('summaryDelivery').textContent = 
        deliveryCharge > 0 ? `Rs. ${deliveryCharge}` : 'FREE';
    document.getElementById('summaryTotal').textContent = 
        currentOrder.product.price > 0 ? `Rs. ${total}` : 'Contact for Price';
}

// Submit Order
function submitOrder() {
    // Collect form data
    const formData = {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        city: document.getElementById('customerCity').value,
        area: document.getElementById('deliveryArea').value.trim(),
        address: document.getElementById('fullAddress').value.trim(),
        quantity: currentOrder.quantity,
        deliveryTime: document.getElementById('deliveryTime').value,
        instructions: document.getElementById('specialInstructions').value.trim(),
        paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Calculate totals
    const subtotal = currentOrder.product.price * currentOrder.quantity;
    const total = subtotal + currentOrder.deliveryCharge;
    
    // Prepare WhatsApp message
    const message = createWhatsAppMessage(formData, subtotal, total);
    
    // Send to WhatsApp
    sendToWhatsApp(message);
    
    // Show confirmation
    showOrderConfirmation();
    
    // Reset form after delay
    setTimeout(resetOrderForm, 3000);
}

// Validate Form
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name) errors.push('Full name is required');
    if (!formData.phone || formData.phone.length < 11) errors.push('Valid WhatsApp number is required (11 digits)');
    if (!formData.city) errors.push('Please select your city');
    if (!formData.area) errors.push('Please enter your area/sector');
    if (!formData.address) errors.push('Please enter your complete address');
    
    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// Create WhatsApp Message
function createWhatsAppMessage(formData, subtotal, total) {
    const orderDetails = `📦 *ORDER DETAILS:*
• Product: ${currentOrder.product.name}
• Quantity: ${formData.quantity} pack(s)
• Unit Price: ${currentOrder.product.price > 0 ? `Rs. ${currentOrder.product.price}` : 'Custom Order'}
• Subtotal: ${currentOrder.product.price > 0 ? `Rs. ${subtotal}` : 'Will be confirmed'}
• Delivery: ${currentOrder.deliveryCharge > 0 ? `Rs. ${currentOrder.deliveryCharge}` : 'FREE'}
• Total Amount: ${currentOrder.product.price > 0 ? `Rs. ${total}` : 'Contact for confirmation'}

📋 *CUSTOMER INFORMATION:*
• Name: ${formData.name}
• WhatsApp: ${formData.phone}
• Email: ${formData.email || 'Not provided'}
• City: ${formData.city.charAt(0).toUpperCase() + formData.city.slice(1)}
• Area: ${formData.area}
• Address: ${formData.address}
• Preferred Time: ${getDeliveryTimeText(formData.deliveryTime)}
• Special Instructions: ${formData.instructions || 'None'}

💰 *PAYMENT METHOD:* ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}

📅 *ORDER TIME:* ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`;

    const greeting = `🍯 *${BUSINESS_NAME.toUpperCase()} - NEW GUR ORDER* 🍯\n\n`;
    const closing = `\n\n_Thank you for choosing ${BUSINESS_NAME}! We will contact you shortly to confirm your order and delivery timing._`;
    
    return greeting + orderDetails + closing;
}

// Get Delivery Time Text
function getDeliveryTimeText(timeValue) {
    const times = {
        'any': 'Any Time',
        'morning': 'Morning (9 AM - 12 PM)',
        'afternoon': 'Afternoon (12 PM - 4 PM)',
        'evening': 'Evening (4 PM - 8 PM)'
    };
    return times[timeValue] || 'Any Time';
}

// Send to WhatsApp
function sendToWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Show Order Confirmation
function showOrderConfirmation() {
    alert(`✅ Order Submitted Successfully!\n\nWe have opened WhatsApp with your order details. Please send the message and we will contact you within minutes to confirm.\n\n📞 Contact: +${WHATSAPP_NUMBER}\n📧 Email: ${BUSINESS_EMAIL}\n\nThank you for choosing ${BUSINESS_NAME}! 🍯`);
}

// Reset Order Form
function resetOrderForm() {
    const form = document.getElementById('orderForm');
    if (form) {
        form.reset();
        document.getElementById('customerPhone').value = '03';
        document.getElementById('orderQuantity').value = 1;
        currentOrder.quantity = 1;
        updateOrderSummary();
    }
}

// FAQ Accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');
            
            // Toggle active class
            faqItem.classList.toggle('active');
            
            // Toggle icon
            if (faqItem.classList.contains('active')) {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherItem = otherQuestion.parentElement;
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('i');
                    otherItem.classList.remove('active');
                    otherAnswer.style.display = 'none';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
    });
}

// Add to Cart Function (for homepage)
function addToCart(productType) {
    // Save selected product to sessionStorage
    sessionStorage.setItem('selectedProduct', productType);
    
    // Redirect to order page
    window.location.href = `order.html?product=${productType}`;
}

// Direct WhatsApp Message
function sendDirectWhatsApp() {
    const message = `Hello ${BUSINESS_NAME}! I'm interested in your premium gur. Please provide more information about your products.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
}

// Export functions to global scope
window.addToCart = addToCart;
window.sendDirectWhatsApp = sendDirectWhatsApp;

window.changeQuantity = changeQuantity;


