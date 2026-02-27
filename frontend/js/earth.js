// Initialize Three.js Scene
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create Earth
const geometry = new THREE.SphereGeometry(10, 64, 64);

// Use a high-quality earth texture loaded dynamically
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('../assets/earth_texture.jpg'); // We downloaded this

const material = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.4, // Shiny
  metalness: 0.7, // Brighter reflections
  color: 0x88bbff, // Much lighter, brighter cyan/blue tint
  emissive: 0x112244, // Slight inner glow
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Brighter ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2.5, 100); // Stronger primary light
pointLight.position.set(20, 10, 20);
scene.add(pointLight);

const backLight = new THREE.PointLight(0x88ccff, 1.5, 100); // Brighter, light-blue backlight
backLight.position.set(-20, 10, -20);
scene.add(backLight);

// Animation Variables
let baseRotationSpeed = 0.001; // Slow constant rotation
let isAnimatingFast = false;
let scrollUnlocked = false;

// Main Render Loop
function animate() {
  requestAnimationFrame(animate);

  // Apply base rotation
  earth.rotation.y += baseRotationSpeed;

  // Slight tilt for aesthetics
  earth.rotation.x = 0.2;

  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Intro Animation Logic Triggered by Scroll Attempt
const body = document.body;
const handleInitialScroll = (e) => {
  if (scrollUnlocked || isAnimatingFast) return;

  // Detect scroll intent
  if (e.deltaY > 0 || e.type === 'touchstart') {
    isAnimatingFast = true;

    // Fast rotation animation (1.5 seconds)
    gsap.to(earth.rotation, {
      y: earth.rotation.y + Math.PI * 6, // spin 3 full times very fast
      duration: 1.5,
      ease: "power3.inOut",
      onComplete: () => {
        // Unlock scroll quickly
        unlockScroll();
      }
    });

    // Also zoom into the earth slightly
    gsap.to(camera.position, {
      z: 10,
      duration: 1.5,
      ease: "power3.inOut"
    });
  }
};

window.addEventListener('wheel', handleInitialScroll, { passive: false });
window.addEventListener('touchstart', handleInitialScroll, { passive: false });

function unlockScroll() {
  scrollUnlocked = true;
  body.classList.remove('locked-scroll');

  // Clean up initial listeners
  window.removeEventListener('wheel', handleInitialScroll);
  window.removeEventListener('touchstart', handleInitialScroll);

  // Initialize ScrollTrigger animations
  initScrollAnimations();

  // Programmatically scroll down slightly to indicate unlocked state
  window.scrollTo({
    top: 100,
    behavior: 'smooth'
  });
}

// Scroll Animations (GSAP ScrollTrigger)
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Link Earth rotation/scale to scroll position
  gsap.to(earth.rotation, {
    y: earth.rotation.y + Math.PI * 2,
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrub
    }
  });

  gsap.to(camera.position, {
    z: 5, // zoom way in as they scroll to bottom
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
    }
  });

  // Fade out main title on scroll quickly
  gsap.to("#main-title", {
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "200px top", // Fade out much faster
      scrub: true
    }
  });

  // Fade in CTA
  gsap.to(".cta-container", {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".content-section",
      start: "top 80%", // trigger when section is 80% in view
      toggleActions: "play none none reverse"
    }
  });

  // Fade in Navbar (Login/Signup buttons)
  gsap.to(".navbar", {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".content-section", // same trigger as the CTA
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
}
