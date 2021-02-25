export class Counter {
    private timerId?: NodeJS.Timeout;
    private value = 0;

    start() {
        if (!this.timerId) {
            this.timerId = setInterval(() => this.tick(), 1000);
        }
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.value = 0;
    }

    getCount() {
        return this.value;
    }

    tick() {
        this.value++;
    }
}
