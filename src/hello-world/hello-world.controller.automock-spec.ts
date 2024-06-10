import { Test, TestingModule } from '@nestjs/testing';
import { TestBed } from '@automock/jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { HelloWorldController } from '@/hello-world/hello-world.controller';
import { HelloWorldService } from '@/hello-world/hello-world.service';
import { describe, it, expect } from '@jest/globals';

const MODULE_MOCKER = new ModuleMocker(global);

describe(HelloWorldController.name, () => {
  describe(HelloWorldController.prototype.greet.name, () => {
    /**
     * https://docs.nestjs.com/recipes/automock
     * https://github.com/automock/automock
     * https://automock.dev/
     */
    it('uses @automock/jest', () => {
      const { unit, unitRef } = TestBed.create(HelloWorldController).compile();

      const helloWorldController = unit;
      const helloWorldService: jest.Mocked<HelloWorldService> =
        unitRef.get(HelloWorldService);

      helloWorldController.greet();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(helloWorldService.getGreeting).toHaveBeenCalled();
    });

    /**
     * https://docs.nestjs.com/fundamentals/testing#auto-mocking
     * https://github.com/jestjs/jest/tree/main/packages/jest-mock
     */
    it('uses jest-mock', async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [HelloWorldController],
      })
        .useMocker((token) => {
          if (token === HelloWorldService) {
            return {
              getGreeting: jest.fn().mockReturnValue('Hello World! (mocked)'),
            };
          }
          if (typeof token === 'function') {
            const mockMetadata = MODULE_MOCKER.getMetadata(
              token,
            ) as MockFunctionMetadata<any, any>;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const Mock = MODULE_MOCKER.generateFromMetadata(mockMetadata);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return new Mock();
          }

          throw new Error(`Unexpected token: ${String(token)}`);
        })
        .compile();

      const helloWorldController = moduleRef.get(HelloWorldController);
      const helloWorldService: jest.Mocked<HelloWorldService> =
        moduleRef.get(HelloWorldService);

      helloWorldController.greet();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(helloWorldService.getGreeting).toHaveBeenCalled();
    });

    /**
     * https://github.com/golevelup/nestjs/tree/master/packages/testing/ts-jest
     */
    it('uses @golevelup/ts-jest', async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [HelloWorldController],
        providers: [
          {
            provide: HelloWorldService,
            useValue: createMock<HelloWorldService>(),
          },
        ],
      }).compile();

      const helloWorldController =
        app.get<HelloWorldController>(HelloWorldController);
      const helloWorldService =
        app.get<DeepMocked<HelloWorldService>>(HelloWorldService);

      helloWorldController.greet();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(helloWorldService.getGreeting).toHaveBeenCalled();
    });
  });
});
