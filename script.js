document.addEventListener('DOMContentLoaded', function () {

  // ═══════════════════════════════════════════════
  // Theme Picker
  // ═══════════════════════════════════════════════

  var themePicker = document.getElementById('themePicker');
  var themeOptions = document.querySelectorAll('.theme-option');
  var openButtons = document.querySelectorAll('#openThemePicker');

  // Lock page scrolling while the picker is open, so on a phone a swipe
  // scrolls the modal instead of the page behind it
  function openPicker() {
    if (!themePicker) return;
    themePicker.classList.add('active');
    document.body.classList.add('theme-picker-open');
  }

  function closePicker() {
    if (!themePicker) return;
    themePicker.classList.remove('active');
    document.body.classList.remove('theme-picker-open');
  }

  // Show theme picker if no theme is saved (first visit)
  if (!localStorage.getItem('theme') && themePicker) {
    setTimeout(openPicker, 500);
  }

  // Open theme picker on button click
  openButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (themePicker) {
        openPicker();
        updateSelectedOption();
      }
    });
  });

  // Close theme picker when clicking overlay (not the modal itself),
  // the close button, or pressing Escape
  if (themePicker) {
    themePicker.addEventListener('click', function(e) {
      if (e.target === themePicker) {
        closePicker();
      }
    });
  }

  var closeButton = document.getElementById('closeThemePicker');
  if (closeButton) {
    closeButton.addEventListener('click', closePicker);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && themePicker && themePicker.classList.contains('active')) {
      closePicker();
    }
  });

  // Update selected state based on current theme
  function updateSelectedOption() {
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'minimal';
    themeOptions.forEach(function(opt) {
      if (opt.getAttribute('data-theme') === currentTheme) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  }

  // Handle theme selection
  themeOptions.forEach(function(option) {
    option.addEventListener('click', function() {
      var theme = this.getAttribute('data-theme');

      // Apply theme
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      // Update selected state
      themeOptions.forEach(function(opt) {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');

      // Close picker after short delay
      setTimeout(closePicker, 200);
    });
  });


  // ═══════════════════════════════════════════════
  // Gradient Cycling (for gradients theme)
  // ═══════════════════════════════════════════════

  var gradientsContainer = document.querySelector('.gradients-bg');

  if (gradientsContainer) {
    function cycleGradients() {
      var current = gradientsContainer.querySelector('.gradient.current');
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
      var allGradients = gradientsContainer.querySelectorAll('.gradient');
      var next = allGradients[0];

      // Set up next: opacity 0, no transition, move to end (top of stack)
      next.style.transition = 'none';
      next.style.opacity = '0';
      next.classList.add('current');
      gradientsContainer.appendChild(next);

      // Force reflow before starting next transition
      void next.offsetHeight;

      cycleGradients();
    }

    // Small delay to ensure DOM is fully painted
    setTimeout(cycleGradients, 200);
  }


  // ═══════════════════════════════════════════════
  // Active Nav Link
  // ═══════════════════════════════════════════════

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


  // ═══════════════════════════════════════════════
  // Mobile Nav Toggle
  // ═══════════════════════════════════════════════

  var toggle = document.querySelector('.nav-toggle');
  var navLinksContainer = document.querySelector('.nav-links');

  if (toggle && navLinksContainer) {
    // The button already had an aria-label, but nothing told assistive tech
    // whether the menu was currently open or closed — it announced the same
    // thing in both states.
    function setNavOpen(open) {
      navLinksContainer.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setNavOpen(!navLinksContainer.classList.contains('open'));
    });

    navLinksContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });
  }


  // ═══════════════════════════════════════════════
  // Scroll Reveal (Intersection Observer)
  // ═══════════════════════════════════════════════

  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
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
