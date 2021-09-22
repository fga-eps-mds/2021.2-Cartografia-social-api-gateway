import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { MidiaController } from '../../src/midia/midia.controller';

describe('MidiaController', () => {
  let controller: MidiaController;

  const customModule = async (fn: any) => {
    return await Test.createTestingModule({
      providers: [
        {
          provide: 'MIDIA_SERVICE',
          useValue: {
            send: fn,
          },
        },
      ],
      controllers: [MidiaController],
    }).compile();
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MIDIA_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
      controllers: [MidiaController],
    }).compile();

    controller = module.get<MidiaController>(MidiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload midia ', async () => {
    const file = {
      fieldname: 'file',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      size: 8,
      stream: null,
      destination: null,
      filename: null,
      path: null,
    };

    const result = {
      asset_id: 'fc92a7220a24f3aca8dccb6a0d59fc56',
      public_id: 'bfuv1vwi2hmowrjwyaxh',
      version: 1632330093,
      version_id: 'd3fd59825199ae990a728e90741c222c',
      signature: 'fc02a27eb48cbb1f8ba2f859da19b653958d3a41',
      width: 384,
      height: 332,
      format: 'png',
      resource_type: 'image',
      created_at: '2021-09-22T17:01:33Z',
      tags: [],
      bytes: 1995,
      type: 'upload',
      etag: 'cf9b4ee84dbcc43bfaf59b8971aa0d25',
      placeholder: false,
      url: 'http://res.cloudinary.com/nova-cartografia-social/image/upload/v1632330093/bfuv1vwi2hmowrjwyaxh.png',
      secure_url:
        'https://res.cloudinary.com/nova-cartografia-social/image/upload/v1632330093/bfuv1vwi2hmowrjwyaxh.png',
      original_filename: 'file',
      api_key: '156751358469945',
    };

    const module = await await customModule(
      jest.fn(() => new Observable((sub) => sub.next(result))),
    );

    controller = module.get<MidiaController>(MidiaController);

    expect(await controller.uploadMidia(file)).toStrictEqual(result);
  });
});
