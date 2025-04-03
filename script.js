// This script is obfuscated to add an extra layer of security
(function() {
    // Password hash (set to "gameserver" for this example)
    // In a real implementation, use a stronger hashing algorithm
    const HASH = "8c60221f358b4a4aaf54bdc5c3547fc20cbca35b5363a4126fc5a8e7013bae45";

    // Store server data in an encrypted format
    const encryptedData = "U2FsdGVkX19lGd17s7fGLXZs3ZWdZsHRIJRTl9aA8x8r1n+wYZ2eYlwyS9yXx2ZgmMRmC2JuZzJIfxrFzF1xJdHv1R5RqyhcqG6Q6o9J8IrLR4Y+bF0l0y/EUaXr79jBkl8lBzWtOXCPxqMJXxhOg+z5Ct1A9Y1aVFZUKQTgP83kxLWJ4A6O6YDfwZ+u7cjnC0CVFbPeOX1/EQPUPdOAz/sG7Sj4rNjBxdGRcTLjXLvPZFvjJiTXvuHvWlQI0mNF";
    
    // Helper function to update the current time
    function updateTime() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        
        const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        // Update both time displays
        const loginTimeEl = document.getElementById('login-time');
        const currentTimeEl = document.getElementById('current-time');
        
        if (loginTimeEl) loginTimeEl.textContent = formattedTime;
        if (currentTimeEl) currentTimeEl.textContent = formattedTime;
    }
    
    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize Feather icons
        feather.replace();
        
        // Initialize particle.js
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": "#7289DA" },
                    "shape": {
                        "type": "circle",
                        "stroke": { "width": 0, "color": "#000000" },
                        "polygon": { "nb_sides": 5 }
                    },
                    "opacity": {
                        "value": 0.5, "random": false,
                        "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
                    },
                    "size": {
                        "value": 3, "random": true,
                        "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                    },
                    "line_linked": {
                        "enable": true, "distance": 150, "color": "#7289DA", "opacity": 0.4, "width": 1
                    },
                    "move": {
                        "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false,
                        "out_mode": "out", "bounce": false,
                        "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": { "enable": true, "mode": "grab" },
                        "onclick": { "enable": true, "mode": "push" },
                        "resize": true
                    },
                    "modes": {
                        "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                        "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                        "repulse": { "distance": 200, "duration": 0.4 },
                        "push": { "particles_nb": 4 },
                        "remove": { "particles_nb": 2 }
                    }
                },
                "retina_detect": true
            });
        }
        
        // SHA-256 hash function
        async function sha256(message) {
            // Convert the message string to a Uint8Array
            const msgBuffer = new TextEncoder().encode(message);
            // Hash the message
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            // Convert the hash to a hex string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }
        
        // Setup password verification
        const passwordInput = document.getElementById('password-input');
        const submitButton = document.getElementById('submit-password');
        const errorMessage = document.getElementById('error-message');
        const passwordOverlay = document.getElementById('password-overlay');
        const mainContent = document.getElementById('main-content');
        
        // Handle password submission
        submitButton.addEventListener('click', async function() {
            const password = passwordInput.value.trim();
            
            if (!password) {
                errorMessage.textContent = 'Please enter a password';
                return;
            }
            
            try {
                // Hash the entered password
                const hashedPassword = await sha256(password);
                
                // Compare with stored hash
                if (hashedPassword === HASH) {
                    // Password correct
                    passwordOverlay.style.display = 'none';
                    mainContent.style.display = 'block';
                    
                    // Use session storage to keep user logged in for this session
                    sessionStorage.setItem('authenticated', 'true');
                } else {
                    // Password incorrect
                    errorMessage.textContent = 'Incorrect password';
                    passwordInput.value = '';
                }
            } catch (err) {
                console.error('Error during password verification:', err);
                errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
        
        // Support pressing Enter key
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
        
        // Handle logout/lock button
        const lockButton = document.getElementById('lock-button');
        if (lockButton) {
            lockButton.addEventListener('click', function() {
                // Clear authentication and show password screen
                sessionStorage.removeItem('authenticated');
                mainContent.style.display = 'none';
                passwordOverlay.style.display = 'flex';
                // Clear password field
                passwordInput.value = '';
                errorMessage.textContent = '';
            });
        }
        
        // Check if user is authenticated
        if (sessionStorage.getItem('authenticated') === 'true') {
            passwordOverlay.style.display = 'none';
            mainContent.style.display = 'block';
        }
        
        // Server connection handlers
        const connectButtons = document.querySelectorAll('.connect-button:not(.disabled)');
        connectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const server = this.getAttribute('data-server');
                
                // Handle connection based on server type
                // This would connect to your actual servers in a real implementation
                alert(`Connecting to ${server} server...`);
            });
        });
        
        // Update the time immediately and then every second
        updateTime();
        setInterval(updateTime, 1000);
    });
})();
