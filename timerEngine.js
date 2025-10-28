(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    global.TimerEngine = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  function defaultNow() {
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    }
    return Date.now();
  }

  class TimerEngine {
    constructor(config = {}, options = {}) {
      const {
        onTick = null,
      } = config;

      this.onTick = typeof onTick === 'function' ? onTick : null;

      this.hiddenInterval = options.hiddenInterval || 250;
      this.now = options.now || defaultNow;
      this.scheduleFrame = options.scheduleFrame || (typeof requestAnimationFrame === 'function' ? requestAnimationFrame.bind(globalThis) : null);
      this.cancelFrame = options.cancelFrame || (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame.bind(globalThis) : null);
      this.scheduleTimeout = options.scheduleTimeout || ((cb, ms) => setTimeout(cb, ms));
      this.clearTimeoutFn = options.clearTimeout || (id => clearTimeout(id));
      this.visibilityProvider = options.visibilityProvider || (() => (typeof document !== 'undefined' ? document.visibilityState || 'visible' : 'visible'));

      this.isRunningFlag = false;
      this.startEpochMs = 0;
      this.accumulatedMs = 0;

      this._rafId = null;
      this._timeoutId = null;

      this._tick = this._tick.bind(this);
    }

    start() {
      if (this.isRunningFlag) {
        return;
      }
      this.isRunningFlag = true;
      this.startEpochMs = this.now();
      this._emit();
      this._scheduleTick();
    }

    pause() {
      if (!this.isRunningFlag) {
        return;
      }
      const now = this.now();
      this.accumulatedMs += now - this.startEpochMs;
      this.isRunningFlag = false;
      this._cancelTick();
      this._emit();
    }

    reset() {
      this.isRunningFlag = false;
      this.accumulatedMs = 0;
      this.startEpochMs = this.now();
      this._cancelTick();
      this._emit();
    }

    getElapsedMs() {
      if (!this.isRunningFlag) {
        return this.accumulatedMs;
      }
      const now = this.now();
      return this.accumulatedMs + (now - this.startEpochMs);
    }

    isRunning() {
      return this.isRunningFlag;
    }

    handleVisibilityChange() {
      if (!this.isRunningFlag) {
        return;
      }
      this._scheduleTick();
      this._emit();
    }

    setState({ accumulatedMs = 0, isRunning = false, startEpochMs = null } = {}) {
      this._cancelTick();
      this.accumulatedMs = accumulatedMs;
      this.isRunningFlag = isRunning;
      this.startEpochMs = startEpochMs !== null ? startEpochMs : this.now();
      if (this.isRunningFlag) {
        // normalise epoch to now so elapsed derived from performance
        this.startEpochMs = this.now();
        this._scheduleTick();
      }
      this._emit();
    }

    getState() {
      return {
        isRunning: this.isRunningFlag,
        startEpochMs: this.startEpochMs,
        accumulatedMs: this.accumulatedMs,
      };
    }

    _emit() {
      if (this.onTick) {
        this.onTick(this.getElapsedMs());
      }
    }

    _tick() {
      if (!this.isRunningFlag) {
        return;
      }
      this._emit();
      this._scheduleTick();
    }

    _scheduleTick() {
      if (!this.isRunningFlag) {
        return;
      }
      this._cancelTick();
      const visibility = this.visibilityProvider();
      if (visibility === 'visible' && typeof this.scheduleFrame === 'function') {
        this._rafId = this.scheduleFrame(() => {
          this._rafId = null;
          this._tick();
        });
      } else {
        this._timeoutId = this.scheduleTimeout(() => {
          this._timeoutId = null;
          this._tick();
        }, this.hiddenInterval);
      }
    }

    _cancelTick() {
      if (this._rafId !== null && typeof this.cancelFrame === 'function') {
        this.cancelFrame(this._rafId);
        this._rafId = null;
      }
      if (this._timeoutId !== null) {
        this.clearTimeoutFn(this._timeoutId);
        this._timeoutId = null;
      }
    }
  }

  return TimerEngine;
});
