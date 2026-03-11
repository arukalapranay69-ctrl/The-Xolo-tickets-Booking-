// ──── HERO SLIDER ────
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots span');
  if (!slides.length) return;
  let current = 0;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(current + 1), 5000);
}

// ──── FILTER CHIPS ────
function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.closest('.filters-bar');
      group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      filterMovies(filter);
    });
  });
}

function filterMovies(filter) {
  const cards = document.querySelectorAll('.movie-card[data-genre]');
  cards.forEach(card => {
    if (!filter || filter === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.genre.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none';
    }
  });
}

// ──── DATE SELECTION ────
function initDateChips() {
  document.querySelectorAll('.date-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

// ──── SHOWTIME SELECTION ────
function initShowtimes() {
  document.querySelectorAll('.time-btn:not(.sold-out)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSummary();
      showToast(`🎬 Showtime selected: ${btn.textContent}`);
    });
  });
}

// ──── SEAT MAP ────
let selectedSeats = [];
const seatPrices = { standard: 180, premium: 280 };

function initSeatMap() {
  document.querySelectorAll('.seat:not(.occupied)').forEach(seat => {
    seat.addEventListener('click', () => {
      const seatId = seat.dataset.id;
      if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
      } else {
        if (selectedSeats.length >= 8) {
          showToast('⚠️ Max 8 seats per booking', 'warn');
          return;
        }
        seat.classList.add('selected');
        selectedSeats.push(seatId);
      }
      updateSummary();
    });
  });
}

function updateSummary() {
  const countEl = document.getElementById('seat-count');
  const tagsEl = document.getElementById('selected-seat-tags');
  const subtotalEl = document.getElementById('subtotal');
  const convFeeEl = document.getElementById('conv-fee');
  const totalEl = document.getElementById('total-amount');

  if (!countEl) return;

  const premiumSeats = selectedSeats.filter(s => s.startsWith('P'));
  const standardSeats = selectedSeats.filter(s => !s.startsWith('P'));
  const subtotal = premiumSeats.length * seatPrices.premium + standardSeats.length * seatPrices.standard;
  const convFee = selectedSeats.length > 0 ? 30 : 0;
  const total = subtotal + convFee;

  countEl.textContent = selectedSeats.length;

  if (tagsEl) {
    tagsEl.innerHTML = selectedSeats.length
      ? selectedSeats.map(s => `<span class="seat-tag">${s}</span>`).join('')
      : '<span style="color:var(--text-muted);font-size:0.82rem">No seats selected</span>';
  }

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (convFeeEl) convFeeEl.textContent = `₹${convFee}`;
  if (totalEl) totalEl.textContent = `₹${total}`;
}

// ──── TOAST ────
function showToast(msg, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.borderLeftColor = type === 'warn' ? '#f4a261' : 'var(--accent)';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ──── PROCEED BUTTON ────
function initProceed() {
  const btn = document.getElementById('proceed-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!selectedSeats.length) {
      showToast('⚠️ Please select at least one seat', 'warn');
      return;
    }
    const activeTime = document.querySelector('.time-btn.active');
    if (!activeTime) {
      showToast('⚠️ Please select a showtime first', 'warn');
      return;
    }
    showToast('✅ Proceeding to payment...', 'info');
    setTimeout(() => {
      alert(`🎟️ Booking Confirmed!\n\nSeats: ${selectedSeats.join(', ')}\nShowtime: ${activeTime.textContent}\n\nTotal: ${document.getElementById('total-amount')?.textContent}\n\nThank you for booking with CineBook!`);
    }, 800);
  });
}

// ──── SEARCH ────
function initSearch() {
  const input = document.querySelector('.nav-search input');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.movie-card[data-title]').forEach(card => {
      card.style.display = card.dataset.title.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ──── INIT ────
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initFilters();
  initDateChips();
  initShowtimes();
  initSeatMap();
  updateSummary();
  initProceed();
  initSearch();
});

