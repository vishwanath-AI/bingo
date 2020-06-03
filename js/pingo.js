import { SoundController } from './sound-controller.js';
import { repository } from './repository.js';

const audio = new SoundController(
  'assets/se_maoudamashii_instruments_drumroll.ogg',
  'assets/se_maoudamashii_instruments_drum1_cymbal.ogg'
);

export const Pingo = {
  props: {
    numbers: Array,
    initialSelectedCount: Number,
  },
  template: `
    <div class="app">
      <div :class="currentNumberClass">{{ formatNumber(currentNumber) }}</div>
      <div class="button-container">
        <button v-if="!started" @click="start" class="spin start">Start</button>
        <button v-else @click="stop(false)" class="spin stop">Stop</button>
      </div>
      <div class="history-container">
        <div v-for="n in maxNumber" :class="historyClass(n)">
          {{ formatNumber(n) }}
        </div>
      </div>
      <div class="button-container">
        <button @click="resetWithConfirm" class="reset">Reset</button>
      </div>
    </div>
  `,
  data() {
    return {
      currentNumberIndex: -1,
      started: false,
      selectedCount: this.initialSelectedCount,
    };
  },
  computed: {
    currentNumber() {
      const i = this.currentNumberIndex;
      return i >= 0 && i < this.numbers.length ? this.numbers[i] : 0;
    },
    selectedNumbers() {
      return this.numbers.slice(0, this.selectedCount);
    },
    maxNumber() {
      return this.numbers.length;
    },
    currentNumberClass() {
      let classNames = ['current-number'];
      if (!this.started) {
        classNames.push('active');
      }
      return classNames;
    },
  },
  methods: {
    rouletto() {
      if (this.started) {
        this.currentNumberIndex = _.random(
          this.selectedCount,
          this.numbers.length - 1
        );
        setTimeout(() => this.rouletto(), 60);
      }
    },
    start() {
      this.started = true;
      audio.play();
      this.rouletto();
    },
    stop(withoutSound) {
      this.started = false;
      if (withoutSound) {
        audio.stopWithoutSound();
      } else {
        audio.stop();
      }
      this.currentNumberIndex = this.selectedCount;
      this.selectedCount++;
      repository.save({
        numbers: this.numbers,
        selectedCount: this.selectedCount,
      });
    },
    toggle() {
      if (!this.started) {
        this.start();
      } else {
        this.stop();
      }
    },
    reset() {
      this.started = false;
      audio.stopWithoutSound();
      this.currentNumberIndex = -1;
      const numbers = _.shuffle(this.numbers);
      const selectedCount = 0;
      repository.save({
        numbers,
        selectedCount,
      });
      this.numbers = numbers;
      this.selectedCount = selectedCount;
    },
    resetWithConfirm() {
      if (confirm('Do you really want to reset?')) {
        this.reset();
      }
    },
    historyClass(n) {
      let classNames = ['history'];
      if (this.selectedNumbers.includes(n)) {
        classNames.push('active');
      }
      return classNames;
    },
    formatNumber(n) {
      let padWidth = 0;
      let m = this.maxNumber;
      for (; m >= 1; padWidth++) {
        m /= 10;
      }
      return _.padStart((n || 0).toString(), padWidth, '0');
    },
  },
  created() {
    audio.setOnEnded(() => {
      this.stop(true);
    });
  },
};
