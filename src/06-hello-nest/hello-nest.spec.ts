import request from "supertest";
import { Test } from "@nestjs/testing";
import { moduleMetadata } from "./app.module";
import { AppController } from "./app.controller";
import { INestApplication } from "@nestjs/common";
import { AppService } from "./app.service";

async function generateModuleRef() {
    const testingModuleBuilder = Test.createTestingModule(moduleMetadata);
    const moduleRef = await testingModuleBuilder.compile();
    return moduleRef;
}

describe("[Chapter 06] NestJS와 함께 시작하기", () => {
    describe("Unit Test", () => {
        let appController: AppController;
        let appService: AppService;

        beforeEach(async () => {
            const moduleRef = await generateModuleRef();
            appController = moduleRef.get(AppController);
            appService = moduleRef.get(AppService);
        });

        test("컨트롤러의 getHello()는 'Hello, World!'를 반환해야 한다.", () => {
            const res = appController.getHello();
            expect(res).toBe("Hello, World!");
        });

        test("서비스의 getHello()는 'Hello, World!'를 반환해야 한다.", () => {
            const res = appService.getHello();
            expect(res).toBe("Hello, World!");
        });
    });

    describe("E2E Test", () => {
        let app: INestApplication;

        beforeEach(async () => {
            const moduleRef = await generateModuleRef();
            app = moduleRef.createNestApplication();
            await app.init();
        });

        test("[/GET api/hello]는 'Hello, World!'를 반환해야 한다.", async () => {
            const res = await request(app.getHttpServer()).get("/api/hello");
            expect(res.status).toBe(200);
            expect(res.text).toBe("Hello, World!");
        });
    });
});
