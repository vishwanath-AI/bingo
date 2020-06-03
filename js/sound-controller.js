export class SoundController {
  constructor(drumRollSrc, cymbalSrc) {
    this.drumRollAudio = new Audio(drumRollSrc);
    this.cymbalAudio = new Audio(cymbalSrc);
    this.onEnded = null;
    this.drumRollAudio.addEventListener('ended', () => {
      if (typeof this.onEnded !== 'function') {
        return;
      }
      this.onEnded();
    });
  }
  play() {
    this.drumRollAudio.currentTime = 0;
    this.drumRollAudio.play();
  }
  stop() {
    this.stopWithoutSound();
    this.cymbalAudio.currentTime = 0;
    this.cymbalAudio.play();
  }
  stopWithoutSound() {
    this.drumRollAudio.pause();
  }
  setOnEnded(onEnded) {
    this.onEnded = onEnded;
  }
}
