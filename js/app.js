/* =========================================================
   happy 21st — app.js
   ========================================================= */

/* ---------------------------------------------------------
   1. SCREEN NAVIGATION
--------------------------------------------------------- */
const app = document.getElementById('app');
const screens = document.querySelectorAll('.screen');
const navDots = document.querySelectorAll('.nav-dot');

function goToScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  navDots.forEach(d =>
    d.classList.toggle('is-active', d.dataset.target === id)
  );

  app.dataset.active = id;

  requestAnimationFrame(() => renderDecor(id));
}

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => {
    goToScreen(btn.dataset.goto);
  });
});

navDots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToScreen(dot.dataset.target);
  });
});


/* ---------------------------------------------------------
   2. ENVELOPE — hover on desktop, tap/click on touch
--------------------------------------------------------- */
const waxSeal = document.getElementById('waxSeal');
const envelopeWrap = document.getElementById('envelopeWrap');
const letterCard = document.getElementById('letterCard');
const envelopeContinue = document.getElementById('envelopeContinue');
const envelopeHint = document.getElementById('envelopeHint');

function openEnvelope() {
  if (!letterCard.classList.contains('hidden')) return;

  envelopeWrap.classList.add('hidden');
  letterCard.classList.remove('hidden');

  envelopeHint.textContent = 'to: Andy';
  envelopeContinue.classList.remove('hidden');

  // The letter is much larger than the envelope,
  // so recalculate the decorative icon positions.
  requestAnimationFrame(() => {
    renderDecor('envelope');
  });
}

/*
  Desktop:
    Hovering over the wax seal opens the letter.

  Phone/tablet:
    Tapping the wax seal opens the letter.

  The hover check prevents hover-only behavior from
  being attached on devices that don't actually support hover.
*/
if (waxSeal) {
  // Works on phones and desktop clicks.
  waxSeal.addEventListener('click', openEnvelope);

  // Only add hover behavior to devices with real mouse hover.
  if (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    waxSeal.addEventListener('mouseenter', openEnvelope);
  }
}


/* ---------------------------------------------------------
   3. GALLERY — click/tap a photo to reveal its memory
--------------------------------------------------------- */
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryModal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    modalImg.src = item.querySelector('img').src;
    modalCaption.textContent = item.dataset.caption;

    galleryModal.classList.add('is-open');
  });
});

modalClose.addEventListener('click', () => {
  galleryModal.classList.remove('is-open');
});

galleryModal.addEventListener('click', e => {
  if (e.target === galleryModal) {
    galleryModal.classList.remove('is-open');
  }
});


/* ---------------------------------------------------------
   4. POKÉMON ROSTER
--------------------------------------------------------- */
const pokemonRoster = [
  {
    name: 'Sprigatito',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/sprigatito.png'
  },
  {
    name: 'Chikorita',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/chikorita.png'
  },
  {
    name: 'Snivy',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/snivy.png'
  },
  {
    name: 'Fennekin',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/fennekin.png'
  },
  {
    name: 'Cyndaquil',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/cyndaquil.png'
  },
  {
    name: 'Litten',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/litten.png'
  },
  {
    name: 'Mudkip',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/mudkip.png'
  },
  {
    name: 'Oshawott',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/oshawott.png'
  },
  {
    name: 'Piplup',
    src: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/piplup.png'
  }
];


/* ---------------------------------------------------------
   5. DECOR
--------------------------------------------------------- */

/*
  Desktop:
    Bigger icons and lots of scattered decorations.

  Mobile:
    Smaller icons and fewer decorations so the page
    doesn't look crowded.
*/
const decorLayer = document.getElementById('decorLayer');

const DECOR_SIZE_DESKTOP = 30;
const DECOR_SIZE_MOBILE = 20;

const POKEMON_SIZE_DESKTOP = 45;
const POKEMON_SIZE_MOBILE = 30;

const ICON_POOL = [
  'px-heart',
  'px-sparkle',
  'px-gem',
  'px-mushroom',
  'px-cloud',
  'px-record',
  'px-note'
];


/* Desktop counts */
const ICON_COUNT_BY_THEME = {
  envelope: 10,
  gallery: 12,
  finale: 14
};

const POKEMON_COUNT_BY_THEME = {
  envelope: 3,
  gallery: 4
};


/* Mobile counts */
const MOBILE_ICON_COUNT_BY_THEME = {
  envelope: 3,
  gallery: 4,
  finale: 5
};

const MOBILE_POKEMON_COUNT_BY_THEME = {
  envelope: 1,
  gallery: 1
};


function isMobileLayout() {
  return window.matchMedia('(max-width: 560px)').matches;
}


/*
  Check whether two rectangles overlap.
*/
function rectsOverlap(a, b, margin = 0) {
  return !(
    a.right + margin <= b.left ||
    a.left - margin >= b.right ||
    a.bottom + margin <= b.top ||
    a.top - margin >= b.bottom
  );
}


/*
  Find a location for a decorative item.

  On desktop:
    Random locations are used.

  On mobile:
    Icons are placed around the edges/corners instead of
    randomly filling the tiny amount of space around the card.
*/
function findDecorSpot(cardRect, size, usedRects, mobile) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const safe = mobile ? 6 : 18;

  const candidates = [];

  if (mobile) {
    /*
      Deliberate edge positions.

      This gives the phone layout a little decoration without
      creating a wall of icons around the card.
    */
    const edge = 8;
    const midY = vh * 0.5;

    const positions = [
      [edge, edge],

      [vw - size - edge, edge],

      [edge, vh - size - edge],

      [vw - size - edge, vh - size - edge],

      [
        edge,
        Math.max(70, midY - size / 2)
      ],

      [
        vw - size - edge,
        Math.max(70, midY - size / 2)
      ],

      [
        Math.max(8, vw * 0.5 - size / 2),
        edge
      ],

      [
        Math.max(8, vw * 0.5 - size / 2),
        vh - size - edge
      ]
    ];

    candidates.push(...positions);

  } else {

    /*
      Desktop has plenty of room, so keep the randomized
      scattered look.
    */
    for (let attempt = 0; attempt < 80; attempt++) {
      candidates.push([
        Math.random() * Math.max(vw - size, 0),
        Math.random() * Math.max(vh - size, 0)
      ]);
    }
  }


  /*
    Test each candidate until we find one that:

    1. Doesn't overlap the card.
    2. Doesn't overlap another decorative item.
  */
  for (const [x, y] of candidates) {

    const candidate = {
      left: x,
      top: y,
      right: x + size,
      bottom: y + size
    };

    // Keep the decoration away from the card.
    if (rectsOverlap(candidate, cardRect, safe)) {
      continue;
    }

    // Keep decorative items from piling on top of each other.
    if (
      usedRects.some(r =>
        rectsOverlap(
          candidate,
          r,
          mobile ? 8 : 10
        )
      )
    ) {
      continue;
    }

    return {
      x,
      y,
      rect: candidate
    };
  }

  // No safe location found.
  return null;
}


/*
  Render all decorations for the current screen.
*/
function renderDecor(themeId) {

  // Remove decorations from the previous screen.
  decorLayer.innerHTML = '';

  // Home intentionally has no floating decorations.
  if (themeId === 'home') return;


  const activeCard = document.querySelector(
    `#${themeId} .pixel-frame`
  );

  if (!activeCard) return;


  const mobile = isMobileLayout();

  const rect = activeCard.getBoundingClientRect();


  const iconSize = mobile
    ? DECOR_SIZE_MOBILE
    : DECOR_SIZE_DESKTOP;

  const pokemonSize = mobile
    ? POKEMON_SIZE_MOBILE
    : POKEMON_SIZE_DESKTOP;


  const iconCount = mobile
    ? (MOBILE_ICON_COUNT_BY_THEME[themeId] || 0)
    : (ICON_COUNT_BY_THEME[themeId] || 0);


  const pokeCount = mobile
    ? (MOBILE_POKEMON_COUNT_BY_THEME[themeId] || 0)
    : (POKEMON_COUNT_BY_THEME[themeId] || 0);


  /*
    Keep track of where we've already placed things.
    This prevents decorations from stacking together.
  */
  const usedRects = [];


  /* ---------------- ICONS ---------------- */

  for (let i = 0; i < iconCount; i++) {

    const iconId =
      ICON_POOL[
        Math.floor(
          Math.random() * ICON_POOL.length
        )
        ];


    const spot = findDecorSpot(
      rect,
      iconSize,
      usedRects,
      mobile
    );


    // If there's no safe space, skip this icon.
    if (!spot) continue;


    const svgNS = 'http://www.w3.org/2000/svg';

    const svg =
      document.createElementNS(
        svgNS,
        'svg'
      );

    const use =
      document.createElementNS(
        svgNS,
        'use'
      );


    use.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href',
      `#${iconId}`
    );


    svg.appendChild(use);

    svg.classList.add('decor-icon');


    /*
      The cloud has a wider viewBox than the other icons.
    */
    svg.setAttribute(
      'viewBox',
      iconId === 'px-cloud'
        ? '0 0 24 16'
        : '0 0 16 16'
    );


    svg.style.width =
      `${iconSize}px`;

    svg.style.height =
      `${iconSize}px`;

    svg.style.left =
      `${spot.x}px`;

    svg.style.top =
      `${spot.y}px`;


    svg.style.animationDelay =
      `-${Math.random() * 0.3}s`;


    usedRects.push(spot.rect);

    decorLayer.appendChild(svg);
  }


  /* ---------------- POKÉMON ---------------- */

  if (pokeCount > 0) {

    const shuffled =
      [...pokemonRoster].sort(
        () => Math.random() - 0.5
      );


    for (
      let i = 0;
      i < pokeCount &&
      i < shuffled.length;
      i++
    ) {

      const p = shuffled[i];


      const spot = findDecorSpot(
        rect,
        pokemonSize,
        usedRects,
        mobile
      );


      // No safe space available.
      if (!spot) continue;


      const img =
        document.createElement('img');


      img.src = p.src;
      img.alt = p.name;
      img.title = p.name;


      img.classList.add(
        'decor-icon',
        'decor-pokemon'
      );


      img.style.width =
        `${pokemonSize}px`;

      img.style.height =
        `${pokemonSize}px`;

      img.style.objectFit =
        'contain';

      img.style.left =
        `${spot.x}px`;

      img.style.top =
        `${spot.y}px`;


      img.style.animationDelay =
        `-${Math.random() * 0.3}s`;


      /*
        If a Pokémon image fails to load,
        just remove it rather than showing a broken image.
      */
      img.onerror = () => {
        img.remove();
      };


      usedRects.push(spot.rect);

      decorLayer.appendChild(img);
    }
  }
}


/* ---------------------------------------------------------
   6. RESIZE HANDLING
--------------------------------------------------------- */

/*
  Don't re-render dozens of times while someone is actively
  resizing the browser window.
*/
let resizeTimer;

window.addEventListener('resize', () => {

  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {

    renderDecor(
      app.dataset.active
    );

  }, 120);
});


/* ---------------------------------------------------------
   7. INITIAL SCREEN
--------------------------------------------------------- */

goToScreen('home');
