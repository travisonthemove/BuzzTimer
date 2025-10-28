#!/usr/bin/env node
'use strict';

const TimerEngine = require('../../timerEngine');

class FakeClock {
  constructor() {
    this._now = 0;
    this._queue = [];
    this._nextId = 1;
  }

  now() {
    return this._now;
  }

  schedule(cb, delay) {
    const id = this._nextId++;
    const due = this._now + Math.max(0, delay);
    this._queue.push({ id, due, cb });
    this._queue.sort((a, b) => a.due - b.due);
    return id;
  }

  clear(id) {
    this._queue = this._queue.filter(item => item.id !== id);
  }

  advance(ms) {
    const target = this._now + ms;
    this._drainUntil(target);
    this._now = target;
  }

  sleep(ms) {
    this._now += ms;
  }

  flush() {
    this._drainUntil(this._now);
  }

  _drainUntil(target) {
    this._queue.sort((a, b) => a.due - b.due);
    while (this._queue.length && this._queue[0].due <= target) {
      const next = this._queue.shift();
      this._now = Math.max(this._now, next.due);
      next.cb();
      this._queue.sort((a, b) => a.due - b.due);
    }
  }
}

const createTestTimer = (clock, initialVisibility = 'visible') => {
  let visibility = initialVisibility;
  const timer = new TimerEngine(
    { onTick: () => {} },
    {
      now: () => clock.now(),
      scheduleFrame: null,
      scheduleTimeout: (cb, ms) => clock.schedule(cb, ms),
      clearTimeout: id => clock.clear(id),
      hiddenInterval: 100,
      visibilityProvider: () => visibility,
    }
  );

  return {
    timer,
    setVisibility: state => {
      visibility = state;
    },
  };
};

const results = [];

const recordApprox = (name, actual, expected, tolerance) => {
  const diff = Math.abs(actual - expected);
  const pass = diff <= tolerance;
  results.push({
    name,
    pass,
    details: `expected ${expected}ms ±${tolerance}ms, got ${Math.round(actual)}ms (diff ${Math.round(diff)}ms)`,
  });
};

(() => {
  const clock = new FakeClock();
  const { timer } = createTestTimer(clock);

  timer.start();
  clock.advance(3000);
  timer.pause();

  recordApprox('start → wait 3s → pause', timer.getElapsedMs(), 3000, 100);
})();

(() => {
  const clock = new FakeClock();
  const { timer } = createTestTimer(clock);

  timer.start();
  clock.advance(1000);
  timer.pause();

  clock.advance(500); // time passes while paused, should not accumulate

  timer.start();
  clock.advance(1000);
  timer.pause();

  recordApprox('start/pause/start totals ≈2s', timer.getElapsedMs(), 2000, 100);
})();

(() => {
  const clock = new FakeClock();
  const { timer, setVisibility } = createTestTimer(clock);

  timer.start();
  clock.advance(1000);

  setVisibility('hidden');
  timer.handleVisibilityChange();
  clock.advance(3000);

  setVisibility('visible');
  timer.handleVisibilityChange();

  recordApprox('hidden fallback adds 3s', timer.getElapsedMs(), 4000, 120);
})();

(() => {
  const clock = new FakeClock();
  const { timer } = createTestTimer(clock);

  timer.start();
  clock.advance(500);

  clock.sleep(5000); // simulate system sleep where callbacks are delayed
  clock.flush(); // callbacks fire on wake

  recordApprox('sleep/wake accounts for 5s gap', timer.getElapsedMs(), 5500, 150);
})();

console.log('Timer Engine Regression Tests');
results.forEach((result, index) => {
  const status = result.pass ? 'PASS' : 'FAIL';
  console.log(`${index + 1}. ${status} ${result.name} — ${result.details}`);
});

const failures = results.filter(r => !r.pass);
if (failures.length > 0) {
  console.error(`\n${failures.length} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${results.length} tests passed.`);
}
