document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Scroll Reveal Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Functional Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    // 4. Close mobile menu automatically when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    });

    // 5. Corrected Form Submission & EmailJS Implementation
    const reservationForm = document.getElementById("reservationForm");
    
    if (reservationForm) {
        reservationForm.addEventListener("submit", function(event) {
            event.preventDefault(); // STOPS browser page refresh

            const submitBtn = reservationForm.querySelector(".form-submit-btn");
            const originalBtnText = submitBtn.innerHTML;
            
            // Visual feedback updates
            submitBtn.innerHTML = "Sending... <i class='fa-solid fa-spinner fa-spin'></i>";
            submitBtn.disabled = true;

            const params = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            };

            // FIX: Removed syntax minus sign & structured properly
            // Format parameters: emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
            emailjs.send("service_p5zpjwp", "template_3q67wvq", params)
                .then((response) => {
                    alert("Thank you! Your table reservation request has been sent.");
                    reservationForm.reset(); // Clears all input parameters on success
                })
                .catch((error) => {
                    alert("Oops! Something went wrong while processing your request. Please try again.");
                    console.error("EmailJS Execution Failure Error Details:", error);
                })
                .finally(() => {
                    // Reverts button back to stable functional state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});

async function loadMenu() {
  try {
    // 1. Fetch the data from your JSON file
    const response = await fetch('/menu.json');
    const data = await response.json();
    
    // 2. Find the menu-grid container in your HTML
    const menuGrid = document.querySelector('.menu-grid');
    
    // 3. Clear any placeholder content inside it
    menuGrid.innerHTML = '';
    
    // 4. Map (loop) through each food item and turn it into HTML strings
    menuGrid.innerHTML = data.menu_items.map(item => `
      <div class="food-card fade-in-up" style="transition-delay: ${item.delay};">
          <div class="card-img">
              <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="card-content">
              <h3>${item.name}</h3>
              <p class="price">${item.price}</p>
          </div>
      </div>
    `).join(''); // Join eliminates unwanted commas between cards
    
  } catch (error) {
    console.error("Error loading the menu data:", error);
  }
}

// Fire the function immediately when the webpage loads
document.addEventListener('DOMContentLoaded', loadMenu);