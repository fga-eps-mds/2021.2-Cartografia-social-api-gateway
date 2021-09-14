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
    this.envConfig.firebase = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey:
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER,
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
