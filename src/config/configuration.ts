export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = +process.env.API_GATEWAY_PORT;
    this.envConfig.userService = {
      queueName: process.env.USERS_SERVICE_RABBIT_QUEUE_NAME,
      host: process.env.USERS_SERVICE_RABBIT_HOST,
    };
    this.envConfig.comunidadeService = {
      queueName: process.env.COMUNIDADES_SERVICE_RABBIT_QUEUE_NAME,
      host: process.env.COMUNIDADES_SERVICE_RABBIT_HOST,
    };
    this.envConfig.mapaService = {
      queueName: process.env.MAPAS_SERVICE_RABBIT_QUEUE_NAME,
      host: process.env.MAPAS_SERVICE_RABBIT_HOST,
    };
    this.envConfig.midiaService = {
      queueName: process.env.MIDIAS_SERVICE_RABBIT_QUEUE_NAME,
      host: process.env.MIDIAS_SERVICE_RABBIT_HOST,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
