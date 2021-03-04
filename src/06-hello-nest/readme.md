# NestJS와 통합하기

## 모듈 컴파일하기

```ts
const moduleMetadata: ModuleMetadata = {
    imports: [],
    controllers: [AppController],
    providers: [AppService],
};

async function generateModuleRef() {
    const testingModuleBuilder = Test.createTestingModule(moduleMetadata);
    const moduleRef = await testingModuleBuilder.compile();
    return moduleRef;
}
```

---

## 유닛 테스트

```ts
const moduleRef = generateModuleRef();

//
// 모듈에서 컨트롤러와 서비스 얻어오기.
// 해당 모듈의 의존성 주입 컨테이너에서, 인자로 주어진 Key와 연관된 Value를 가져온다.
const appController = moduleRef.get(AppController);
const appService = moduleRef.get(AppService);

//
// 아래와 같이 테스트하기.
expect(appController.getHello()).toBe("Hello, World!");
expect(appService.getHello()).toBe("Hello, World!");
```

---

## E2E 테스트

```ts
import request from "supertest";

const moduleRef = generateModuleRef();
const app = moduleRef.createNestApplication();
await app.init();

const res = await request(app.getHttpServer()).get("/api/hello");
expect(res.status).toBe(200);
expect(res.text).toBe("Hello, World!");
```
