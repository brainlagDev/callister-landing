function scrollToSection(id) 
{
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() 
{
  const topBar = document.querySelector('.top-bar');
  const gamesSection = document.getElementById('games');
  const scrollBtn = document.getElementById('scrollToTopBtn');

  function checkHeader() 
  {
    const gamesTop = gamesSection.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > gamesTop - 80) 
    { 
      topBar.classList.add('hide');
      scrollBtn.classList.add('show');
    } else {
      topBar.classList.remove('hide');
      scrollBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkHeader);
});

function scrollToTop() 
{
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateScrollBtnTheme() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;

  // Temporarily hide the button to detect the element underneath
  btn.style.visibility = 'hidden';

  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const elem = document.elementFromPoint(x, y);

  // Restore the button's visibility
  btn.style.visibility = 'visible';

  let isDark = false;
  let current = elem;
  while (current && current !== document.body) {
    const bg = window.getComputedStyle(current).backgroundColor;
    if (bg && (bg === 'rgb(0, 0, 0)' || bg === '#000' || bg.includes('rgba(0, 0, 0)'))) {
      isDark = true;
      break;
    }
    current = current.parentElement;
  }

  btn.classList.toggle('light', isDark);
  btn.classList.toggle('dark', !isDark);
}

// Call this on scroll and on load
window.addEventListener('scroll', updateScrollBtnTheme);
window.addEventListener('resize', updateScrollBtnTheme);
document.addEventListener('DOMContentLoaded', updateScrollBtnTheme);