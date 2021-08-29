export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = +process.env.API_GATEWAY_PORT;
    this.envConfig.userService = {
      queueName: process.env.RABBIT_QUEUE_NAME,
      host: process.env.RABBIT_HOST,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
