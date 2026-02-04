document.addEventListener('DOMContentLoaded', function () {

  // ─── Active nav link ───
  var navLinks = document.querySelectorAll('.nav-links a');
  var currentPath = window.location.pathname;

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && !href.startsWith('http')) {
      var linkPath = href.replace('./', '/').replace('index.html', '');
      var pagePath = currentPath.endsWith('/') ? currentPath : currentPath.substring(currentPath.lastIndexOf('/'));
      if (linkPath === pagePath || currentPath.endsWith(href.replace('./', ''))) {
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

    // Close mobile nav when a link is clicked
    navLinksContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // ─── Scroll reveal (Intersection Observer) ───
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Stagger the reveals slightly
          var delay = Array.prototype.indexOf.call(reveals, entry.target) * 100;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
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
