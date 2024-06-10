import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { describe, it, beforeEach } from '@jest/globals';
import { HelloWorldModule } from '@/hello-world/hello-world.module';
import { HelloWorldController } from '@/hello-world/hello-world.controller';

describe('API: ' + HelloWorldController.name, () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HelloWorldModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(HelloWorldController.prototype.greet.name, () => {
    return request(app.getHttpServer())
      .get('/hello-world')
      .expect(200)
      .expect('Hello World!');
  });
});
