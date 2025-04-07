import {EventModule} from './events.js';


// Initialize the EventModule
const eventModule = new EventModule();
eventModule.setupEventListeners();
// Initialize the scrollToSection method for smooth scrolling
const links = document.querySelectorAll('.nav-link');
links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    eventModule.scrollToSection(targetId);
  });
});
// Initialize the scrollToSection method for smooth scrolling
const scrollToTopButton = document.getElementById('scrollToTop');
if (scrollToTopButton) {
  scrollToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    eventModule.scrollToSection('#top');
  });
}

