interface State {
  scrollMin: number;
  scrollMax: number;

  contentWidth: number;

  startX: number;
  startScrollLeft: number;
  lastX: number;
  lastScrollLeft: number;
  lastTs: number;
  vx: number;
}

export class ScrollCalculator {
  state: State;

  // for momentum
  private momentumDecay: number;
  private stopVelocity: number;

  // for bounce back
  private omegaN = 20 / 1000; // 固有角周波数
  private zeta = 1; // 減衰比

  constructor(options: { stopVelocity: number; momentumDecay: number }) {
    this.state = {
      scrollMin: 0,
      scrollMax: 0,

      contentWidth: 0,

      startX: 0,
      startScrollLeft: 0,
      lastX: 0,
      lastScrollLeft: 0,
      lastTs: 0,
      vx: 0,
    };

    this.momentumDecay = options.momentumDecay;
    this.stopVelocity = options.stopVelocity;
  }

  init(args: {
    startX: number;
    scrollLeft: number;
    timeStamp: number;
    scrollWidth: number;
    contentWidth: number;
  }) {
    this.state = {
      scrollMin: 0,
      scrollMax: args.scrollWidth - args.contentWidth,

      contentWidth: args.contentWidth,

      startX: args.startX,
      startScrollLeft: args.scrollLeft,
      lastX: args.startX,
      lastScrollLeft: args.scrollLeft,

      lastTs: args.timeStamp,
      vx: 0,
    };
  }

  update(mouseX: number, timeStamp: number): { scrollLeft: number; transform: number } {
    const dx = this.state.lastX - mouseX;
    const dt = timeStamp - this.state.lastTs;

    if (dt != 0) {
      const vx = dx / dt;

      this.state = {
        ...this.state,
        lastX: mouseX,
        lastScrollLeft: this.state.lastScrollLeft + dx,
        lastTs: timeStamp,
        vx,
      };
    }

    return this.scrollOrTransform();
  }

  updateInMomentum(timeStamp: number): { scrollLeft: number; transform: number; stop: boolean } {
    if (this.state.lastScrollLeft < this.state.scrollMin) {
      // Bounce back
      const dt = timeStamp - this.state.lastTs;

      const k = this.omegaN * this.omegaN;
      const d = 2 * this.zeta * this.omegaN;

      const a = k * (this.state.scrollMin - this.state.lastScrollLeft) - d * this.state.vx;
      const newVx = this.state.vx + a * dt;
      const newScrollLeft = this.state.lastScrollLeft + this.state.vx * dt;
      const stop =
        (newVx > 0 && this.state.scrollMin < newScrollLeft) ||
        (newVx > 0 && newVx < this.stopVelocity);

      this.state = {
        ...this.state,
        lastScrollLeft: stop ? this.state.scrollMin : newScrollLeft,
        lastTs: timeStamp,
        vx: newVx,
      };

      return { ...this.scrollOrTransform(), stop };
    } else if (this.state.scrollMax < this.state.lastScrollLeft) {
      // Bounce back
      const dt = timeStamp - this.state.lastTs;

      const k = this.omegaN * this.omegaN;
      const d = 2 * this.zeta * this.omegaN;

      const a = -k * (this.state.lastScrollLeft - this.state.scrollMax) - d * this.state.vx;
      const newVx = this.state.vx + a * dt;
      const newScrollLeft = this.state.lastScrollLeft + this.state.vx * dt;
      const stop =
        (newVx < 0 && newScrollLeft < this.state.scrollMax) ||
        (newVx < 0 && -newVx < this.stopVelocity);

      this.state = {
        ...this.state,
        lastScrollLeft: stop ? this.state.scrollMax : newScrollLeft,
        lastTs: timeStamp,
        vx: newVx,
      };

      return { ...this.scrollOrTransform(), stop };
    } else {
      const dt = timeStamp - this.state.lastTs;
      const dx = this.state.vx * dt;
      const newScrollLeft = this.state.lastScrollLeft + dx;
      const newVx = this.state.vx * this.momentumDecay ** (dt / 16); // 60FPS環境（dt = 16）正規化するといいらしい。
      const stop = Math.abs(this.state.vx) < this.stopVelocity;

      this.state = {
        ...this.state,
        lastScrollLeft: newScrollLeft,
        lastTs: timeStamp,
        vx: newVx,
      };

      return { ...this.scrollOrTransform(), stop };
    }
  }

  end(): { scrollLeft: number; transform: number } {
    if (this.state.lastScrollLeft < this.state.scrollMin) {
      return {
        scrollLeft: 0,
        transform: 0,
      };
    } else if (this.state.scrollMax < this.state.lastScrollLeft) {
      return {
        scrollLeft: this.state.scrollMax,
        transform: 0,
      };
    }

    return { scrollLeft: this.state.lastScrollLeft, transform: 0 };
  }

  scrollOrTransform(): { scrollLeft: number; transform: number } {
    if (this.state.lastScrollLeft < this.state.scrollMin) {
      const scrollLeft = rubberBand(this.state.lastScrollLeft, this.state.contentWidth);

      return {
        scrollLeft: 0,
        transform: -scrollLeft,
      };
    } else if (this.state.scrollMax < this.state.lastScrollLeft) {
      const offset = this.state.lastScrollLeft - this.state.scrollMax;
      const scrollLeft = rubberBand(offset, this.state.contentWidth);

      return {
        scrollLeft: 0,
        transform: -this.state.scrollMax - scrollLeft,
      };
    }

    return { scrollLeft: this.state.lastScrollLeft, transform: 0 };
  }
}

const rubberBand = (offset: number, dimension: number) => {
  const constant = 0.55;
  return (
    ((dimension * constant * Math.abs(offset)) / (dimension + constant * Math.abs(offset))) *
    Math.sign(offset)
  );
};
