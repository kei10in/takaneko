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

  // スクロール中かを判別するための値。
  totalMove: number;
  totalDuration: number;
}

export class ScrollCalculator {
  state: State;

  // for momentum
  private momentumDecay: number;
  private stopVelocity: number;

  // for bounce back
  private omegaN = 12 / 1000; // 固有角周波数
  private zeta = 1; // 減衰比

  constructor(options: { stopVelocity?: number | undefined; momentumDecay?: number | undefined }) {
    const { stopVelocity = 0.02, momentumDecay = 0.95 } = options;

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

      totalMove: 0,
      totalDuration: 0,
    };

    this.momentumDecay = momentumDecay;
    this.stopVelocity = stopVelocity;
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

      totalMove: 0,
      totalDuration: 0,
    };
  }

  /**
   * 慣性スクロール中に再度ドラッグされた場合の初期化
   */
  reInit(args: {
    startX: number;
    scrollLeft: number;
    timeStamp: number;
    scrollWidth: number;
    contentWidth: number;
  }) {
    // 今の実装でほとんどの場合うまく動いていますが、オーバーシュートしたときの
    // 挙動だけまだおかしいです。

    const inOverScroll =
      this.state.lastScrollLeft < this.state.scrollMin ||
      this.state.scrollMax < this.state.lastScrollLeft;

    if (inOverScroll) {
      // オーバースクロールのときに PointerDown された場合、信用できない値があるため
      // 過去の値を利用する。
      this.state = {
        scrollMin: this.state.scrollMin,
        scrollMax: this.state.scrollMax,

        contentWidth: args.contentWidth,

        startX: this.state.startX,
        startScrollLeft: this.state.startScrollLeft,
        lastX: this.state.lastX,
        lastScrollLeft: this.state.lastScrollLeft,

        lastTs: args.timeStamp,
        vx: 0,

        totalMove: 0,
        totalDuration: 0,
      };
    } else {
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

        totalMove: 0,
        totalDuration: 0,
      };
    }
  }

  /**
   * スクロール操作中かどうかを返します。
   * クリック操作の可能性がある場合は `false` を返します。
   * 確実にスクロール操作である場合に `true` を返します。
   */
  get isScrolling() {
    return this.state.totalMove > 5 || this.state.totalDuration > 50;
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

        totalMove: this.state.totalMove + Math.abs(dx),
        totalDuration: this.state.totalDuration + dt,
      };
    }

    return this.scrollOrTransform();
  }

  updateBounceBack(args: { timeStamp: number; target: number }): {
    scrollLeft: number;
    transform: number;
    stop: boolean;
  } {
    const { timeStamp, target } = args;

    // Bounce back
    const dt = timeStamp - this.state.lastTs;

    const k = this.omegaN * this.omegaN;
    const d = 2 * this.zeta * this.omegaN;
    const a = -k * (this.state.lastScrollLeft - target) - d * this.state.vx;
    const vxNew = this.state.vx + a * dt;

    const dx = vxNew * dt;
    const newScrollLeft = this.state.lastScrollLeft + dx;
    const stop = Math.abs(vxNew) < this.stopVelocity && Math.abs(newScrollLeft - target) < 0.5;

    this.state = {
      ...this.state,
      lastScrollLeft: stop ? target : newScrollLeft,
      lastTs: timeStamp,
      vx: vxNew,
    };

    return { ...this.scrollOrTransform(), stop };
  }

  updateInMomentum(timeStamp: number): { scrollLeft: number; transform: number; stop: boolean } {
    if (this.state.lastScrollLeft < this.state.scrollMin) {
      // Bounce back
      return this.updateBounceBack({ timeStamp, target: this.state.scrollMin });
    } else if (this.state.scrollMax < this.state.lastScrollLeft) {
      // Bounce back
      return this.updateBounceBack({ timeStamp, target: this.state.scrollMax });
    } else {
      const dt = timeStamp - this.state.lastTs;
      const newVx = this.state.vx * this.momentumDecay ** (dt / 16); // 60FPS環境（dt = 16）正規化するといいらしい。

      const dx = newVx * dt;
      const newScrollLeft = this.state.lastScrollLeft + dx;
      const stop = Math.abs(newVx) < this.stopVelocity;

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
