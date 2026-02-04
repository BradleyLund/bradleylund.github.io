document.addEventListener('DOMContentLoaded', function () {

  // ─── Gradient cycling (replaces jQuery Transit) ───
  var container = document.querySelector('.gradients');

  if (container) {
    function cycleGradients() {
      var current = container.querySelector('.gradient.current');
      if (!current) return;

      // Fade current gradient in over 7.5s
      current.style.transition = 'opacity 7.5s linear';
      current.style.opacity = '1';

      // Safety timeout in case transitionend doesn't fire
      var safety = setTimeout(function () {
        advance(current);
      }, 8000);

      current.addEventListener('transitionend', function handler() {
        current.removeEventListener('transitionend', handler);
        clearTimeout(safety);
        advance(current);
      });
    }

    function advance(current) {
      current.classList.remove('current');

      // Get the first gradient div and make it the next to cycle
      var allGradients = container.querySelectorAll('.gradient');
      var next = allGradients[0];

      // Set up next: opacity 0, no transition, move to end (top of stack)
      next.style.transition = 'none';
      next.style.opacity = '0';
      next.classList.add('current');
      container.appendChild(next);

      // Force reflow before starting next transition
      void next.offsetHeight;

      cycleGradients();
    }

    // Small delay to ensure DOM is fully painted
    setTimeout(cycleGradients, 200);
  }


  // ─── Active nav link ───
  var navLinks = document.querySelectorAll('.nav-links a');
  var currentPath = window.location.pathname;

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && !href.startsWith('http')) {
      var cleanHref = href.replace('./', '');
      if (currentPath.endsWith(cleanHref)) {
        link.classList.add('active');
      }
    }
  });


  // ─── Mobile nav toggle ───
  var toggle = document.querySelector('.nav-toggle');
  var navLinksContainer = document.querySelector('.nav-links');

  if (toggle && navLinksContainer) {
    toggle.addEventListener('click', function () {
      navLinksContainer.classList.toggle('open');
    });

    navLinksContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinksContainer.classList.remove('open');
      });
    });
  }


  // ─── Scroll reveal (Intersection Observer) ───
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var revealIndex = 0;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger reveals by their order in the DOM
          var idx = Array.prototype.indexOf.call(reveals, entry.target);
          var delay = idx * 120;

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

});
