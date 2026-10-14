(function () {
  var root = document.documentElement;
  root.classList.add('reveal-on');
  var motionAllowed = root.classList.contains('motion');

  var toggle = document.querySelector('[data-theme-toggle]');

  function resolvedTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') {
      return explicit;
    }
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (queryError) {
      return 'light';
    }
  }

  function syncToggle(theme) {
    if (!toggle) {
      return;
    }
    var goingDark = theme !== 'dark';
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    toggle.setAttribute('aria-label', goingDark ? 'Switch to dark theme' : 'Switch to light theme');
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (storageError) {}
    syncToggle(theme);
  }

  syncToggle(resolvedTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(resolvedTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  var revealTargets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function revealAll() {
    revealTargets.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  if (!motionAllowed || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    revealTargets.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var watched = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) {
      watched.push({ link: link, section: section });
    }
  });

  if (watched.length && 'IntersectionObserver' in window) {
    var activeId = null;

    function setActive(id) {
      if (id === activeId) {
        return;
      }
      activeId = id;
      watched.forEach(function (pair) {
        if (pair.section.id === id) {
          pair.link.setAttribute('aria-current', 'true');
        } else {
          pair.link.removeAttribute('aria-current');
        }
      });
    }

    var visible = {};
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visible[entry.target.id] = true;
        } else {
          delete visible[entry.target.id];
        }
      });

      var bestId = null;
      var bestTop = Infinity;
      watched.forEach(function (pair) {
        if (visible[pair.section.id]) {
          var top = pair.section.getBoundingClientRect().top;
          if (top < bestTop) {
            bestTop = top;
            bestId = pair.section.id;
          }
        }
      });
      if (bestId) {
        setActive(bestId);
      }
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.05, 0.25] });

    watched.forEach(function (pair) {
      navObserver.observe(pair.section);
    });
  }
})();
