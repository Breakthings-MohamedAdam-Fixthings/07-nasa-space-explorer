/* Main setup */
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
setupDateInputs(startInput, endInput);

/* API configuration */
const API_KEY = 'rsaQnQiC0RUM0I1lryzFwb6sLTL2DEhfwgE0i2P5';

/* Space facts data */
const spaceFacts = [
  "The Sun accounts for 99.86% of the mass in the solar system.",
  "One day on Venus is longer than one year on Venus.",
  "There are more stars in the universe than grains of sand on Earth.",
  "The Great Wall of China is not visible from space with the naked eye.",
  "Jupiter has at least 79 moons.",
  "A year on Mercury is just 88 Earth days.",
  "The Milky Way galaxy is about 100,000 light-years across.",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "The universe is about 13.8 billion years old.",
  "Black holes can have the mass of billions of suns."
];

// Display random space fact
function displayRandomFact() {
  const factText = document.getElementById('factText');
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factText.textContent = spaceFacts[randomIndex];
}

// Fetch images from NASA API
async function fetchSpaceImages(startDate, endDate) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
      const message = (data.error && data.error.message) || data.msg || 'NASA API error';
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<div class="placeholder"><p>Could not load images: ' + error.message + '</p></div>';
    return [];
  }
}

// Compute the number of days between two YYYY-MM-DD dates
function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / msPerDay) + 1;
}

// Display gallery
function displayGallery(images) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  const items = images.filter(item => item.media_type === 'image');
  if (!items.length) {
    gallery.innerHTML = '<div class="placeholder"><p>No image items found in this date range. Try another range.</p></div>';
    return;
  }

  items.forEach(image => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${image.url}" alt="${image.title}" />
      <p><strong>${image.title}</strong></p>
      <p>${image.date}</p>
    `;
    item.addEventListener('click', () => openModal(image));
    gallery.appendChild(item);
  });
}

// Open modal
function openModal(image) {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalExplanation = document.getElementById('modalExplanation');

  modalImage.src = image.url;
  modalImage.alt = image.title;
  modalTitle.textContent = image.title;
  modalDate.textContent = image.date;
  modalExplanation.textContent = image.explanation;

  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Event listeners
document.getElementById('getImagesBtn').addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  const days = daysBetween(startDate, endDate);
  if (days > 100) {
    alert('NASA APOD returns a maximum of 100 images at once. Showing first 100 days from the start date.');
    const adjustedDate = new Date(startDate);
    adjustedDate.setDate(adjustedDate.getDate() + 99);
    endInput.value = adjustedDate.toISOString().split('T')[0];
  }

  document.getElementById('loading').style.display = 'block';
  document.getElementById('gallery').innerHTML = '';

  const images = await fetchSpaceImages(startDate, endInput.value);
  document.getElementById('loading').style.display = 'none';
  displayGallery(images);
});

// Modal close events
document.querySelector('.close').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});

// Sparkle effect on hover in gallery
const galleryContainer = document.getElementById('gallery');
galleryContainer.addEventListener('mousemove', (event) => {
  const targetItem = event.target.closest('.gallery-item');
  if (!targetItem) return;
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = `${event.clientX}px`;
  sparkle.style.top = `${event.clientY}px`;

  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 600);
});

// Initialize
displayRandomFact();
