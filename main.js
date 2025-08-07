function scrollToSection(id) 
{
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() 
{
  const topBar = document.querySelector('.top-bar');
  const gamesSection = document.getElementById('games');

  function checkHeader() 
  {
    const gamesTop = gamesSection.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > gamesTop - 80) 
      { 
      topBar.classList.add('hide');
    } else {
      topBar.classList.remove('hide');
    }
  }

  window.addEventListener('scroll', checkHeader);
});