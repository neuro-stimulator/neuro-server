// describe('Experiments controller', () => {
  // let testingModule: TestingModule;
  // let controller: ExperimentsController;
  // let experimentsService: ExperimentsService;

  // beforeEach(async () => {
  //   testingModule = await Test.createTestingModule({
  //     controllers: [ExperimentsController],
  //     providers: [
  //       ExperimentsService,
  //       serialProvider,
  //       ExperimentRepository,
  //       ExperimentErpRepository,
  //       ExperimentCvepRepository,
  //       ExperimentFvepRepository,
  //       ExperimentTvepRepository,
  //       ExperimentReaRepository,
  //       SettingsService,
  //       {
  //         provide: EntityManager,
  //         useFactory: mockEntityManagerFactory
  //       }
  //     ]
  //     // providers: [
  //     //   {
  //     //     provide: ExperimentsService,
  //     //     useFactory: () => ({
  //     //       findAll: jest.fn(() => true),
  //     //       byId: jest.fn(() => true),
  //     //       insert: jest.fn(() => true),
  //     //       update: jest.fn(() => true),
  //     //       delete: jest.fn(() => true),
  //     //       usedOutputMultimedia: jest.fn(() => true),
  //     //     }),
  //     //   },
  //     //   {
  //     //     provide: ExperimentRepository,
  //     //     useFactory: () => ({
  //     //       all: jest.fn(() => true),
  //     //       one: jest.fn(() => true),
  //     //       insert: jest.fn(() => true),
  //     //       update: jest.fn(() => true),
  //     //       delete: jest.fn(() => true),
  //     //     })
  //     //   }
  //     // ],
  //   }).compile();
  //   controller = testingModule.get(ExperimentsController);
  //   experimentsService = testingModule.get(ExperimentsService);
  // });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });

  // describe('all', () => {
  //   it('should return all experiments', async () => {
  //     const em = testingModule.get(EntityManager) as MockType<{getRepository: () => any}>;
  //     const repository = em.getRepository(ExperimentEntity) as MockType<Repository<any>>;
  //     repository.find.mockReturnValue([]);
  //     await controller.all();
  //     expect(repository.find).toHaveBeenCalled();
  //     expect(repository.find).toReturnWith([]);
  //   });
  // });
// });
