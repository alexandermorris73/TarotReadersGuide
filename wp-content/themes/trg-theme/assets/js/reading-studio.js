(function () {
  'use strict';

  const studio = document.querySelector('[data-reading-studio]');
  if (!studio) return;

  const deck = [
    { name: 'The Hermit', art: 0, upright: 'A little quiet can bring your own judgement back into focus. You may already know which part of this matters most.', reversedText: 'Time alone may have turned into a loop. A grounded second perspective could help you see what is still open.' },
    { name: 'The Lantern', art: 0, upright: 'A small, steady light is enough for the next part. You do not need to solve the whole story today.', reversedText: 'Trying to see every step at once can dim what is already clear. Choose one question you can answer now.' },
    { name: 'The Listening Path', art: 0, upright: 'Notice the detail you keep returning to. It may point toward a need that has not had much room yet.', reversedText: 'Old advice may be louder than your own experience. Check what still fits you, and what no longer does.' },
    { name: 'Still Water', art: 0, upright: 'Give the first reaction a moment to settle. A calmer view can make the useful signal easier to distinguish.', reversedText: 'Waiting for perfect certainty may keep you stuck. What would a careful, low-stakes experiment look like?' },
    { name: 'Two of Paths', art: 1, upright: 'Two possibilities can both matter. Compare the values each path asks you to protect, not only the outcome you hope for.', reversedText: 'A choice made to please everyone can hide your own preference. Name what you would choose if nobody needed convincing.' },
    { name: 'The Crossroads', art: 1, upright: 'You are at a point where attention can become action. One small decision may reveal more than another round of guessing.', reversedText: 'A rushed turn can come from pressure rather than readiness. Separate the deadline from the fear around it.' },
    { name: 'The Open Gate', art: 1, upright: 'A new option may be available, even if it asks for a different approach. Curiosity can be a practical first step.', reversedText: 'An open door is still a choice. Check the cost in time, energy, or money before you step through.' },
    { name: 'The First Step', art: 1, upright: 'Momentum grows from a move small enough to make today. You can learn from the step without promising the whole journey.', reversedText: 'Starting over is not the only way forward. Look for one useful piece you can carry from what already happened.' },
    { name: 'The Star', art: 2, upright: 'Hope can be quiet and ordinary: a steadier rhythm, a kind conversation, or enough rest to think clearly.', reversedText: 'If optimism feels far away, begin with care rather than a big promise. What would help you feel a little more supported?' },
    { name: 'The Hope Garden', art: 2, upright: 'Something worth tending may be growing slowly. Consistency and patience can matter more than a dramatic sign.', reversedText: 'You cannot tend every part of life at once. What can wait, and what needs your care first?' },
    { name: 'Quiet Repair', art: 2, upright: 'Recovery can happen in small pieces. Give yourself permission to notice progress that would be easy to overlook.', reversedText: 'Being hard on yourself will not make healing faster. Try the standard of care you would offer someone you respect.' },
    { name: 'The North Light', art: 2, upright: 'A dependable value can help you orient when the details keep shifting. Let it guide the next question, not dictate an answer.', reversedText: 'A distant ideal may be making the present feel like failure. Bring your attention back to the next reachable point.' }
  ];

  const focusNames = { connection: 'connection', work: 'work and direction', change: 'a change', open: 'your open question' };
  const positions = [
    { title: 'What you are bringing', prompt: 'What part of this story do you already understand?' },
    { title: 'What deserves attention', prompt: 'What detail would be useful to look at with patience?' },
    { title: 'A small next step', prompt: 'What is one kind, practical action within your control?' }
  ];
  const form = studio.querySelector('[data-reading-form]');
  const results = studio.querySelector('[data-reading-results]');
  const cardsNode = studio.querySelector('[data-reading-cards]');
  const summary = studio.querySelector('[data-reading-summary]');
  const question = studio.querySelector('#trg-question-input');
  const note = studio.querySelector('[data-journal-note]');
  const status = studio.querySelector('[data-note-status]');
  const storageKey = 'trg-private-reflection-note-v1';

  function shuffledCards() {
    const cards = deck.slice();
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards.slice(0, 3).map((card) => ({ ...card, isReversed: Math.random() < 0.28 }));
  }

  function renderCard(card, position) {
    const article = document.createElement('article');
    article.className = 'trg-reading-card';
    article.setAttribute('aria-label', position.title + ': ' + card.name + (card.isReversed ? ', reversed' : ''));
    const label = document.createElement('p');
    label.className = 'trg-reading-card__position';
    label.textContent = position.title;

    const face = document.createElement('div');
    face.className = 'trg-reading-card__face' + (card.isReversed ? ' is-reversed' : '');
    face.setAttribute('aria-label', card.name + (card.isReversed ? ', reversed' : ''));
    const art = document.createElement('div');
    art.className = 'trg-reading-card__art';
    art.style.backgroundPosition = (card.art * 50) + '% center';
    const title = document.createElement('span');
    title.className = 'trg-reading-card__title';
    title.textContent = card.name + (card.isReversed ? ' · reversed' : '');
    face.append(art, title);

    const meaning = document.createElement('p');
    meaning.className = 'trg-reading-card__meaning';
    meaning.textContent = card.isReversed ? card.reversedText : card.upright;
    const prompt = document.createElement('p');
    prompt.className = 'trg-reading-card__prompt';
    const labelText = document.createElement('strong');
    labelText.textContent = 'A question to keep';
    prompt.append(labelText, document.createTextNode(position.prompt));
    article.append(label, face, meaning, prompt);
    return article;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="focus"]:checked');
    const focusName = focusNames[selected ? selected.value : 'open'];
    const writtenQuestion = question.value.trim();
    cardsNode.replaceChildren(...shuffledCards().map((card, index) => renderCard(card, positions[index])));
    summary.textContent = writtenQuestion
      ? 'A reflection on ' + focusName + '. Your question: “' + writtenQuestion + '”'
      : 'A reflection on ' + focusName + '. Take the prompts that help; leave the rest.';
    results.hidden = false;
    results.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      results.hidden = true;
      cardsNode.replaceChildren();
      question.value = '';
      status.textContent = '';
    }, 0);
  });

  studio.querySelector('[data-save-note]').addEventListener('click', () => {
    try {
      const value = note.value.trim();
      if (!value) {
        status.textContent = 'Write a note first. Nothing has been saved.';
        return;
      }
      window.localStorage.setItem(storageKey, value);
      status.textContent = 'Saved in this browser.';
    } catch (error) {
      status.textContent = 'Browser storage is unavailable. Your note was not saved.';
    }
  });

  studio.querySelector('[data-clear-note]').addEventListener('click', () => {
    try {
      window.localStorage.removeItem(storageKey);
      note.value = '';
      status.textContent = 'Saved note cleared from this browser.';
    } catch (error) {
      status.textContent = 'Browser storage is unavailable. Clear this note manually.';
    }
  });

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) note.value = saved;
  } catch (error) {
    status.textContent = 'Browser storage is unavailable. Notes will not persist.';
  }
})();
