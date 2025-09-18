interface State {
  dragging: boolean;

  scrollWidth: number;
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
  private momentumDecay: number;
  private stopVelocity: number;

  constructor(options: { stopVelocity: number; momentumDecay: number }) {
    this.state = {
      dragging: false,

      scrollWidth: 0,
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
      dragging: true,

      scrollWidth: args.scrollWidth,
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
    const dx = mouseX - this.state.lastX;
    const dt = timeStamp - this.state.lastTs;

    if (dt != 0) {
      const vx = dx / dt;

      this.state = {
        ...this.state,
        lastX: mouseX,
        lastScrollLeft: this.state.lastScrollLeft - dx,
        lastTs: timeStamp,
        vx,
      };
    }

    return this.scrollOrTransform();
  }

  updateInMomentum(timeStamp: number): { scrollLeft: number; transform: number; stop: boolean } {
    const dt = timeStamp - this.state.lastTs;
    const dx = this.state.vx * dt;
    const newScrollLeft = this.state.lastScrollLeft - dx;
    const newVx = this.state.vx * this.momentumDecay ** (dt / 16); // 60FPS環境（dt = 16）正規化するといいらしい。
    const stop = Math.abs(this.state.vx) < this.stopVelocity;

    console.log("updateInMomentum");
    console.log({ state: this.state, dt, dx, newScrollLeft, newVx, stop, timeStamp });

    this.state = {
      ...this.state,
      lastScrollLeft: newScrollLeft,
      lastTs: timeStamp,
      vx: newVx,
    };

    console.log({ ...this.state, stop });

    return { ...this.scrollOrTransform(), stop };
  }

  end(): { scrollLeft: number; transform: number } {
    if (this.state.lastScrollLeft < 0) {
      return {
        scrollLeft: 0,
        transform: 0,
      };
    } else if (this.state.scrollWidth - this.state.contentWidth < this.state.lastScrollLeft) {
      return {
        scrollLeft: this.state.scrollWidth - this.state.contentWidth,
        transform: 0,
      };
    }

    return { scrollLeft: this.state.lastScrollLeft, transform: 0 };
  }

  scrollOrTransform(): { scrollLeft: number; transform: number } {
    const maxScroll = this.state.scrollWidth - this.state.contentWidth;

    if (this.state.lastScrollLeft < 0) {
      const scrollLeft = rubberBand(this.state.lastScrollLeft, this.state.contentWidth);

      return {
        scrollLeft: 0,
        transform: -scrollLeft,
      };
    } else if (maxScroll < this.state.lastScrollLeft) {
      const offset = this.state.lastScrollLeft - maxScroll;
      const scrollLeft = rubberBand(offset, this.state.contentWidth);

      return {
        scrollLeft: 0,
        transform: -maxScroll - scrollLeft,
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
