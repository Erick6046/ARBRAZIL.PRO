// BetGenius Pricing Page - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const answer = item.querySelector('.faq-answer');
            const isOpen = answer.style.display === 'block';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.querySelector('.faq-answer').style.display = 'none';
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isOpen) {
                answer.style.display = 'block';
                item.classList.add('active');
            } else {
                answer.style.display = 'none';
                item.classList.remove('active');
            }
        });
    });
    
    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click events to buttons
    const trialButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    trialButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Thank you for your interest! Your free trial will start immediately after account verification.');
        });
    });
    
    // Initialize first FAQ as open for better UX
    if (faqItems.length > 0) {
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        firstAnswer.style.display = 'block';
        faqItems[0].classList.add('active');
    }
});

// Function to calculate potential earnings based on plan
function calculateEarnings(planType) {
    let dailySurebets, minProfit, maxProfit;
    
    switch(planType) {
        case 'starter':
            dailySurebets = 50;
            minProfit = 5;
            maxProfit = 7;
            break;
        case 'professional':
            dailySurebets = 200;
            minProfit = 5;
            maxProfit = 10;
            break;
        case 'elite':
            dailySurebets = 500;
            minProfit = 5;
            maxProfit = 12;
            break;
        default:
            dailySurebets = 200;
            minProfit = 5;
            maxProfit = 10;
    }
    
    // Calculate potential monthly earnings
    const daysInMonth = 30;
    const avgProfit = (minProfit + maxProfit) / 2;
    const avgDailyProfit = (dailySurebets * avgProfit) / 100; // Convert percentage to decimal
    const monthlyProfit = avgDailyProfit * daysInMonth;
    
    return {
        dailySurebets: dailySurebets,
        avgDailyProfit: avgDailyProfit.toFixed(2),
        monthlyProfit: monthlyProfit.toFixed(2)
    };
}

// Example of how to use the calculation
console.log('Starter Plan Potential:', calculateEarnings('starter'));
console.log('Professional Plan Potential:', calculateEarnings('professional'));
console.log('Elite Plan Potential:', calculateEarnings('elite'));