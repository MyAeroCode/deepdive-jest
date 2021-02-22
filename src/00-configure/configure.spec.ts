describe("[Chapter 00] 환경설정", () => {
    test("제스트가 글로벌 변수로 노출되어 있어야 한다", () => {
        expect(jest).toBeDefined();
    });
});
