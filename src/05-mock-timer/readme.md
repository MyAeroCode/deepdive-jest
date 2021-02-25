# 모조 타이머

## 모조 타이머가 왜 필요한가요?

N초 뒤의 데이터를 검증해야 하는 경우와 같이 `시간이 충분히 흐른 뒤`의 상태를 예측해야 하는 경우가 있을 수 있습니다. 실제로 N초 만큼 기다리는 방법도 있겠지만, 시간은 금이라는 격언처럼 `테스팅에 걸리는 시간을 최대한 줄여야` 합니다. 모조 타이머는 가상으로 시간을 빨리 감을 수 있는 방법을 제공합니다.

```ts
test("실제로 1초를 기다리는 코드", async () => {
    const srt = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const end = Date.now();

    expect(end - srt).toBeGreaterThanOrEqual(1000);
});
```

```ts
test("가상으로 1시간을 기다리는 코드", () => {
    //
    // 앞으로 setTimer, setInterval를 사용하면 모조 타이머로 대체됨.
    jest.useFakeTimers();

    //
    // 1초마다 카운터를 1 증가시키는 타이머를 부착한다.
    // useFakeTimers()가 설정되었으므로, 아래는 모조 타이머로 대체된다.
    let count = 0;
    setInterval(() => count++, 1000);

    //
    // 가상으로 1시간을 빨리 감는다.
    const srt = Date.now();
    jest.advanceTimersByTime(3600 * 1000);
    const end = Date.now();

    //
    // 눈 깜짝할 사이에 카운터가 3600 증가함.
    expect(count).toBe(3600);
    expect(end - srt).toBeLessThanOrEqual(10);
});
```

이 외에도 다음과 같은 이유가 있습니다.

-   현실 타이머는 약간의 지연시간이 있을 수 있습니다. 모조 타이머는 명시적인 방법에 의해서만 시간이 흐르므로 정교하고 정확하게 테스팅할 수 있습니다.
-   jest는 각 테스트당 타임아웃 값이 정해져있습니다. 현실 타이머로 매번 기다리면 타임아웃 때문에 테스팅이 실패할 수 있습니다.

---

## 무한대기에 빠지는 경우

모조 타이머는 다음과 같이 `명시적인 방법`으로만 시간이 흐릅니다.

```ts
//
// ms만큼 모든 모조 타이머를 빨리 감는다.
jest.advanceTimersByTime(ms);
```

이 사항을 모른채 모조 타이머를 사용하면 무한대기에 빠질 수 있음에 주의해야 합니다. 예를 들어, 아래 코드에서 `setTimeout`이 1초 뒤에 `resolve`를 호출해야 `await`에서 빠져나올 수 있지만, 시간을 흐르게 하는 `advanceTimersByTime`을 만날 수 없으므로 무한대기에 빠집니다.

**잘못된 예제 :**

```ts
test("무한대기에 빠지는 경우", async () => {
    jest.useFakeTimers();

    //
    // 1초만 기다리면 벗어날 수 있을까?..
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //
    // 결코 도달할 수 없는 영역.
    jest.advanceTimersByTime(1000);
});
```

올바르게 변경하려면, 아래와 같이 `advanceTimersByTime`를 안쪽으로 밀어넣어야 합니다.

**올바른 예제 :**

```ts
test("무한대기에 빠지지 않는 경우", async () => {
    jest.useFakeTimers();

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
        jest.advanceTimersByTime(1000);
    });
});
```
