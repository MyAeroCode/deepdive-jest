import { Counter } from "./counter";

describe("[Chapter 05] 가짜 타이머 다루기", () => {
    const ONE_HOUR = 3600 * 1000;

    beforeEach(() => {
        //
        // 각각의 테스트마다 타이머 정보를 초기화한다.
        jest.clearAllTimers();
    });

    test("아래 코드는 실제로 1초를 기다려야 한다", async () => {
        let cnt = 0;
        const srt = Date.now();

        //
        // 실제로 1초를 기다리고, 카운터를 1 증가시킨다.
        await new Promise((resolve) => setTimeout(() => resolve(cnt++), 1000));

        //
        // 카운터의 값은 1이어야 하고,
        // 실제로 1초 이상 기다렸어야 한다.
        const end = Date.now();
        expect(cnt).toBe(1);
        expect(end - srt).toBeGreaterThanOrEqual(1000);
    });

    test("아래 코드는 1시간을 빨리감기한다", () => {
        //
        // jest에서 동작하는 모조 타이머를 사용한다.
        jest.useFakeTimers();

        let cnt = 0;
        const srt = Date.now();

        //
        // 1초마다 카운터를 1 증가시키는 타이머를 부착한다.
        // useFakeTimers()가 설정되었으므로, 아래는 모조 타이머로 대체된다.
        setInterval(() => cnt++, 1000);

        //
        // 현재까지 등록된 모든 모조 타이머의 시간을 1시간 앞당긴다.
        jest.advanceTimersByTime(ONE_HOUR);

        //
        // 카운터의 값은 1이어야 하고,
        // 실제로는 매우 적은 시간이 걸려야 한다.
        const end = Date.now();
        expect(cnt).toBe(3600);
        expect(end - srt).toBeLessThan(1000);
    });

    test("무한대기에 빠지는 경우", async () => {
        jest.useFakeTimers();

        //
        // 모조 타이머들의 시간을 주어진 만큼 빠르게 감는다.
        async function fakeSleep(ms: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);

                //
                // 모조 타이머는 명시적인 호출에 의해서만 시간이 흐르므로,
                // 이 아래 라인을 빼먹으면 무한대기에 빠진다.
                jest.advanceTimersByTime(ms);
            });
        }

        let cnt = 0;
        setTimeout(() => cnt++, ONE_HOUR);
        await fakeSleep(ONE_HOUR);
        expect(cnt).toBe(1);
    });

    test("외부 모듈에서 사용", () => {
        jest.useFakeTimers();

        //
        // 카운터를 생성하고 시작시킨다.
        const counter = new Counter();
        jest.spyOn(counter, "tick");
        counter.start();

        //
        // 1시간을 감으면, 카운터의 값은 3600 이어야 한다.
        jest.advanceTimersByTime(ONE_HOUR);
        expect(counter.getCount()).toBe(3600);
        expect(counter.tick).toHaveBeenCalledTimes(3600);

        //
        // 카운터를 멈추면, 카운터의 값은 0 이어야 한다.
        counter.stop();
        expect(counter.getCount()).toBe(0);
    });
});
