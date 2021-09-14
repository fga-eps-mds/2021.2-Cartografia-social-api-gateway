import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/configuration';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuth {
  private firebaseApp: admin.app.App;

  constructor(@Inject('CONFIG') config: ConfigService) {
    const firebaseConfig = config.get('firebase');

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }

  async verifyUserToken(token: string, necessaryRoles: string[]) {
    const idToken = await this.firebaseApp.auth().verifyIdToken(token);
    const userData = await this.firebaseApp.auth().getUser(idToken.uid);

    const userRoles = Object.keys(userData.customClaims);

    return necessaryRoles.some((role) => userRoles.includes(role));
  }
}
