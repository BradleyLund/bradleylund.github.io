document.addEventListener('DOMContentLoaded', function () {

  // ═══════════════════════════════════════════════
  // Sliding Tile Puzzle Gate
  // ═══════════════════════════════════════════════
  //
  // A 3×3 sliding puzzle the visitor solves to get into the site, captcha
  // style. The inline <head> script adds .puzzle-locked to <html> (which
  // hides the page, see style.css) unless sessionStorage says it was already
  // solved this session — that class is the single source of truth here.

  var unlockCallbacks = [];
  var siteLocked = document.documentElement.classList.contains('puzzle-locked');

  // Run fn now if the site is open, otherwise once the puzzle is solved
  function whenUnlocked(fn) {
    if (siteLocked) unlockCallbacks.push(fn);
    else fn();
  }

  if (siteLocked) buildPuzzleGate();

  function buildPuzzleGate() {
    var SIZE = 3;
    var EMPTY = SIZE * SIZE - 1;   // tile value 8 is the blank
    var board = [];                // board[position] = tile value
    var moves = 0;
    var solved = false;

    var gate = document.createElement('div');
    gate.className = 'puzzle-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'puzzleGateTitle');
    gate.innerHTML =
      '<div class="puzzle-card">' +
        '<p class="puzzle-eyebrow"><i class="fas fa-puzzle-piece"></i> Human check</p>' +
        '<h2 id="puzzleGateTitle">Slide to enter</h2>' +
        '<p class="puzzle-instructions">Put the tiles in order, 1 to 8, with the gap in the bottom-right. ' +
          'Tap a tile next to the gap (or use the arrow keys) to slide it.</p>' +
        '<div class="puzzle-board" role="grid" aria-label="Sliding tile puzzle"></div>' +
        '<div class="puzzle-footer">' +
          '<span class="puzzle-moves" aria-live="polite">Moves: 0</span>' +
          '<button type="button" class="puzzle-shuffle"><i class="fas fa-random"></i> Shuffle</button>' +
        '</div>' +
        '<p class="puzzle-status" aria-live="assertive"></p>' +
        '<button type="button" class="puzzle-skip">Skip puzzle</button>' +
      '</div>';
    document.body.appendChild(gate);

    var boardEl = gate.querySelector('.puzzle-board');
    var movesEl = gate.querySelector('.puzzle-moves');
    var statusEl = gate.querySelector('.puzzle-status');
    var shuffleBtn = gate.querySelector('.puzzle-shuffle');
    var skipBtn = gate.querySelector('.puzzle-skip');

    // One button per numbered tile; they're absolutely positioned and slide
    // between cells via a CSS transform transition
    var tileEls = [];
    for (var v = 0; v < EMPTY; v++) {
      var tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'puzzle-tile';
      tile.textContent = v + 1;
      tile.setAttribute('data-value', v);
      boardEl.appendChild(tile);
      tileEls.push(tile);
    }

    function neighbours(pos) {
      var r = Math.floor(pos / SIZE), c = pos % SIZE, out = [];
      if (r > 0) out.push(pos - SIZE);
      if (r < SIZE - 1) out.push(pos + SIZE);
      if (c > 0) out.push(pos - 1);
      if (c < SIZE - 1) out.push(pos + 1);
      return out;
    }

    function isSolved() {
      for (var i = 0; i < board.length; i++) {
        if (board[i] !== i) return false;
      }
      return true;
    }

    // Shuffle by making random legal moves from the solved state, so the
    // result is always solvable. No immediate back-tracking, and 24 moves
    // keeps it a quick human check rather than a brain-teaser.
    function shuffle() {
      board = [];
      for (var i = 0; i <= EMPTY; i++) board.push(i);
      var blank = EMPTY, prev = -1;
      for (var n = 0; n < 24 || isSolved(); n++) {
        var options = neighbours(blank).filter(function (p) { return p !== prev; });
        var pick = options[Math.floor(Math.random() * options.length)];
        board[blank] = board[pick];
        board[pick] = EMPTY;
        prev = blank;
        blank = pick;
      }
      moves = 0;
      render();
    }

    function render() {
      var blankPos = board.indexOf(EMPTY);
      var movable = neighbours(blankPos);
      board.forEach(function (value, pos) {
        if (value === EMPTY) return;
        var el = tileEls[value];
        el.style.setProperty('--col', pos % SIZE);
        el.style.setProperty('--row', Math.floor(pos / SIZE));
        el.classList.toggle('in-place', value === pos);
        var canMove = movable.indexOf(pos) !== -1;
        el.classList.toggle('movable', canMove && !solved);
        el.disabled = solved;
        el.setAttribute('aria-label', 'Tile ' + (value + 1) +
          (canMove ? ', next to the gap' : ''));
      });
      movesEl.textContent = 'Moves: ' + moves;
    }

    function slide(pos) {
      if (solved) return;
      var blankPos = board.indexOf(EMPTY);
      if (neighbours(blankPos).indexOf(pos) === -1) {
        var el = tileEls[board[pos]];
        el.classList.remove('nudge');
        void el.offsetWidth;   // restart the animation
        el.classList.add('nudge');
        return;
      }
      board[blankPos] = board[pos];
      board[pos] = EMPTY;
      moves++;
      render();
      if (isSolved()) win();
    }

    function win() {
      solved = true;
      render();
      boardEl.classList.add('solved');
      statusEl.textContent = 'Solved in ' + moves + ' move' + (moves === 1 ? '' : 's') + ' — welcome in!';
      shuffleBtn.disabled = true;
      skipBtn.disabled = true;
      setTimeout(unlock, 900);
    }

    // Open the site (solved or skipped) — remembered for this session
    function unlock() {
      try { sessionStorage.setItem('puzzleSolved', '1'); } catch (e) {}
      gate.classList.add('leaving');
      document.documentElement.classList.remove('puzzle-locked');
      siteLocked = false;
      unlockCallbacks.forEach(function (fn) { fn(); });
      setTimeout(function () { gate.remove(); }, 500);
    }

    boardEl.addEventListener('click', function (e) {
      var tile = e.target.closest('.puzzle-tile');
      if (!tile) return;
      slide(board.indexOf(parseInt(tile.getAttribute('data-value'), 10)));
    });

    // Arrow keys move the tile *into* the gap from the opposite side, e.g.
    // ArrowUp slides the tile below the gap upwards
    document.addEventListener('keydown', function (e) {
      if (!siteLocked || solved) return;
      var blankPos = board.indexOf(EMPTY);
      var r = Math.floor(blankPos / SIZE), c = blankPos % SIZE, target = -1;
      if (e.key === 'ArrowUp' && r < SIZE - 1) target = blankPos + SIZE;
      else if (e.key === 'ArrowDown' && r > 0) target = blankPos - SIZE;
      else if (e.key === 'ArrowLeft' && c < SIZE - 1) target = blankPos + 1;
      else if (e.key === 'ArrowRight' && c > 0) target = blankPos - 1;
      if (target === -1) return;
      e.preventDefault();
      slide(target);
    });

    shuffleBtn.addEventListener('click', shuffle);
    skipBtn.addEventListener('click', function () {
      if (!solved) { solved = true; unlock(); }
    });

    shuffle();
  }


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
  // (waits until the puzzle gate is solved, so the two never stack)
  if (!localStorage.getItem('theme') && themePicker) {
    whenUnlocked(function () { setTimeout(openPicker, 500); });
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
