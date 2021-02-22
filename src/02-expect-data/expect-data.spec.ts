describe("[Chapter 02] 데이터 값에 대해 테스팅하기", () => {
    test("[toBe] 원시값 또는 레퍼런스 레벨에서 동작하는 엄격한 동등 검사", () => {
        expect(1).toBe(1);

        //
        // 타입이 달라 일치하지 않음.
        expect(1).not.toBe("1");

        //
        // 두 객체의 레퍼런스가 달라 일치하지 않음.
        expect({}).not.toBe({});
    });

    test("[toEqual, toStrictEqual] 원시값 또는 객체 레벨에서 동작하는 깊은 검사", () => {
        expect(1).toEqual(1);

        //
        // 일반적인 toEqual은 undefined 프로퍼티를 무시한다.
        expect({ a: 1, b: undefined }).toEqual({ a: 1 });

        //
        // undefined 프로퍼티도 엄격하게 검사하려면 toStrictEqual을 사용한다.
        expect({ a: 1, b: undefined }).not.toStrictEqual({ a: 1 });

        //
        // expect.anything()은 null과 undefined를 제외한 모든 것에 매칭된다.
        expect(1).toEqual(expect.anything());
        expect(null).not.toEqual(expect.anything());
        expect(undefined).not.toEqual(expect.anything());

        //
        // expect.any(constructor)는 해당 자료형을 갖는 모든 값에 매칭된다.
        expect(1).toEqual(expect.any(Number));
    });

    test("[toContain, toContainEqual] 배열에 특정 단일 원소가 포함되었는지 검사", () => {
        const items = [1, 2, 3, "4", "5", { a: 1 }];

        //
        // toContain은 깊지않은 검사를 수행한다.
        expect(items).toContain(1);
        expect(items).not.toContain(5);
        expect(items).not.toContain({ a: 1 });

        //
        // toContainEqual은 객체를 만났을 때, 깊은 검사를 수행한다.
        expect(items).toContainEqual({ a: 1 });

        //
        // toEqual과 expect.arrayContaining을 사용하면 다중 원소의 포함 검사도 할 수 있다.
        // 만약, 객체를 만나면 깊은 검사를 수행한다.
        expect(items).toEqual(expect.arrayContaining([1, 2, 3]));
        expect(items).toEqual(expect.arrayContaining([1, "4", { a: 1 }]));
        expect(items).toEqual(expect.arrayContaining([expect.any(Number)]));
        expect(items).not.toEqual(expect.arrayContaining([4, 5]));
    });

    test("[stringContaining, stringMatching] 문자열 내 단어포함 또는 정규식 검사", () => {
        const line = "Hello, World!";
        expect(line).toEqual(expect.stringContaining("Wor"));
        expect(line).toEqual(expect.stringMatching("Wor"));
        expect(line).toEqual(expect.stringMatching(/^Hello, [a-zA-z]+\!$/));
    });

    test("[toHaveLength] length 검사", () => {
        //
        // .length 속성과 동등검사를 실시한다.
        // 해당 속성이 없다면, 해당 테스트는 실패한다.
        expect([1, 2, 3]).toHaveLength(3);
        expect("abcde").toHaveLength(5);
        expect({ length: 999 }).toHaveLength(999);
    });

    test("[toHaveProperty] 깊은 속성 검사", () => {
        const object = {
            x: undefined,
            y: "",
            z: {
                a: {
                    b: 12345,
                },
            },
        };

        //
        // object.xyz라는 프로퍼티는 존재하지 않음.
        expect(object).not.toHaveProperty("xyz");

        //
        // object.x, object.y, object.z라는 프로퍼티는 존재함.
        expect(object).toHaveProperty("x");
        expect(object).toHaveProperty("y");
        expect(object).toHaveProperty("z");

        //
        // object.x의 값은 null이 아니라 undefined이다.
        expect(object).not.toHaveProperty("x", null);
        expect(object).toHaveProperty("x", undefined);

        //
        // 깊게 접근할 수 있음.
        expect(object).toHaveProperty("z.a.b", 12345);

        //
        // 객체를 만날경우 깊은 비교를 수행함.
        expect(object).toHaveProperty("z", { a: { b: 12345 } });
    });

    test("[toBeCloseTo] 실수 근사 검사", () => {
        const actual = 0.1 + 0.2;
        const expected = 0.3;

        //
        // 실수의 태생적인 한계 때문에 (0.1 + 0.2) !== (0.3) 이다.
        expect(actual).not.toBe(expected);

        //
        // actual과 expected의 차이가 (10 ** -n / 2) 보다 작다면 테스트 통과.
        // 두 차이의 절대값이 충분히 작다면, 둘은 같다고 봐도 되기 때문이다.
        expect(actual).toBeCloseTo(expected, 5);

        //
        // 정수에도 적용할 수 있음. (bigint 제외)
        // Math.abs(10 - 6) < 10 ** -(-1) / 2 이므로, 테스트 통과.
        expect(6).toBeCloseTo(10, -1);
    });

    test("기타", () => {
        //
        // undefined, null, NaN 여부 검사
        expect(1).toBeDefined();
        expect(null).toBeDefined();
        expect(undefined).toBeUndefined();
        expect(null).toBeNull();
        expect(NaN).toBeNaN();

        //
        // 참 같은 값, 거짓 같은 값
        expect(1).toBeTruthy();
        expect("Hello").toBeTruthy();
        expect(0).toBeFalsy();
        expect("").toBeFalsy();
        expect(null).toBeFalsy();
        expect(undefined).toBeFalsy();

        //
        // 대소비교 (bigint 포함)
        expect(5).toBeGreaterThan(3);
        expect(5).toBeGreaterThanOrEqual(5);
        expect(5).toBeLessThan(10);
        expect(5).toBeLessThanOrEqual(5);
    });
});
