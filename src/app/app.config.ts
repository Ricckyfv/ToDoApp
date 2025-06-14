import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'crupapp-910b3',
        appId: '1:794549410800:web:01aac7ee46f644176b1b35',
        storageBucket: 'crupapp-910b3.firebasestorage.app',
        apiKey: 'AIzaSyDR22Hip04R484kGL6S3BtNsTXCunAmBY8',
        authDomain: 'crupapp-910b3.firebaseapp.com',
        messagingSenderId: '794549410800',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
