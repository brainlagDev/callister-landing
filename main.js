
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateScrollBtnTheme() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;

  btn.style.visibility = 'hidden';

  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const elem = document.elementFromPoint(x, y);

  btn.style.visibility = 'visible';

  let isDark = false;
  let current = elem;
  while (current && current !== document.body) {
    const bg = window.getComputedStyle(current).backgroundColor || '';
    if (
      bg === 'rgb(0, 0, 0)' ||
      bg === '#000' ||
      bg.includes('rgba(0, 0, 0)')
    ) {
      isDark = true;
      break;
    }
    current = current.parentElement;
  }

  btn.classList.toggle('light', isDark);
  btn.classList.toggle('dark', !isDark);
}

document.addEventListener('DOMContentLoaded', function () {
  const topBar = document.querySelector('.top-bar');
  const gamesSection = document.getElementById('games');
  const scrollBtn = document.getElementById('scrollToTopBtn');

  function checkHeader() {
    if (!gamesSection || !topBar || !scrollBtn) return;
    const gamesTop = gamesSection.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > gamesTop - 80) {
      topBar.classList.add('hide');
      scrollBtn.classList.add('show');
    } else {
      topBar.classList.remove('hide');
      scrollBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkHeader);
  window.addEventListener('resize', checkHeader);
  checkHeader();

  document.querySelectorAll('.game-slideshow').forEach(function (slideshow) {
    const raw = slideshow.dataset.images || '';
    const imgTag = slideshow.querySelector('img');
    let images = [];

    if (raw.trim()) {
      images = raw.split(',').map(function (s) {
        return s.trim();
      }).filter(Boolean);
    }

    if ((!images || images.length === 0) && imgTag && imgTag.src) {
      images = [imgTag.getAttribute('src')];
    }

    if (!imgTag) return;

    let dotsContainer = slideshow.querySelector('.slideshow-dots');
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'slideshow-dots';
      slideshow.appendChild(dotsContainer);
    }

    slideshow.setAttribute('role', slideshow.getAttribute('role') || 'region');
    slideshow.setAttribute('aria-label', slideshow.getAttribute('aria-label') || 'game slideshow');

    let idx = 0;
    let timer = null;
    const transitionMs = 400;

    function showImage(i) {
      if (!images || images.length === 0) return;
      idx = i % images.length;
      // Fade out, change src, fade in
      imgTag.style.transition = 'opacity 0.35s ease';
      imgTag.style.opacity = 0;
      window.setTimeout(function () {
        // Update src (use attribute to preserve relative paths)
        imgTag.setAttribute('src', images[idx]);
        // ensure lazy attribute for non-first images
        if (idx !== 0) imgTag.setAttribute('loading', 'lazy');
        imgTag.style.opacity = 1;
      }, transitionMs / 2);
      // update active dot
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach(function (d, di) {
        d.classList.toggle('active', di === idx);
        d.setAttribute('aria-pressed', di === idx ? 'true' : 'false');
      });
    }

    function startSlideshow() {
      stopSlideshow();
      if (!images || images.length <= 1) return;
      timer = setInterval(function () {
        showImage((idx + 1) % images.length);
      }, 3000);
    }

    function stopSlideshow() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Create dots
    dotsContainer.innerHTML = '';
    images.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
      dot.addEventListener('click', function () {
        stopSlideshow();
        showImage(i);
        startSlideshow();
      });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dot.click();
        }
      });
      dotsContainer.appendChild(dot);
    });

    // Pause on hover/touch
    slideshow.addEventListener('mouseenter', stopSlideshow);
    slideshow.addEventListener('mouseleave', startSlideshow);
    slideshow.addEventListener('touchstart', stopSlideshow, { passive: true });
    slideshow.addEventListener('touchend', startSlideshow, { passive: true });

    // Init
    showImage(0);
    startSlideshow();
  });

  // Update scroll button theme initially
  updateScrollBtnTheme();
  window.addEventListener('scroll', updateScrollBtnTheme);
  window.addEventListener('resize', updateScrollBtnTheme);

  // expose scrollToTop on global in case html uses onclick="scrollToTop()"
  window.scrollToTop = scrollToTop;
  window.scrollToSection = scrollToSection;
});


// Swipe support for mobile
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.game-slideshow').forEach(function (slideshow) {
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let idx = 0;
    const imgTag = slideshow.querySelector('img');
    const images = slideshow.dataset.images.split(',').map(s => s.trim());
    const dotsContainer = slideshow.querySelector('.slideshow-dots');
    let timer;

    function showImage(i) {
      idx = (i + images.length) % images.length;
      imgTag.style.opacity = 0;
      setTimeout(() => {
        imgTag.src = images[idx];
        imgTag.style.opacity = 1;
      }, 200);
      dotsContainer.querySelectorAll('button').forEach((dot, d) => {
        dot.classList.toggle('active', d === idx);
      });
    }

    function startSlideshow() {
      stopSlideshow();
      timer = setInterval(() => {
        showImage(idx + 1);
      }, 3000);
    }

    function stopSlideshow() {
      clearInterval(timer);
    }

    // Setup dots
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.addEventListener('click', () => {
        stopSlideshow();
        showImage(i);
        startSlideshow();
      });
      dotsContainer.appendChild(dot);
    });

    showImage(0);
    startSlideshow();

    // Swipe handlers
    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isSwiping = true;
      stopSlideshow();
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (!isSwiping) return;
      if (touchEndX < touchStartX - 50) {
        showImage(idx + 1);
      } else if (touchEndX > touchStartX + 50) {
        showImage(idx - 1);
      }
      isSwiping = false;
      startSlideshow();
    }, { passive: true });
  });
});
