import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  priority: 'baja' | 'media' | 'alta';
  dueDate?: string;
}

export type TaskCreate = Omit<Task, 'id'>;

const PATH = 'tasks';

@Injectable() //Borramos el Provider: Root, para no mostrar la misma info en cada usuario sin necesidad de recargar la pagina
export class TaskService {
  private _fireStore = inject(Firestore);
  private _collection = collection(this._fireStore, PATH); //Recover info);
  private _authState = inject(AuthStateService);
  private _query = query(this._collection, where('userId', '==', this._authState.currentUser?.uid));


  loading = signal(true);

  constructor(){
    console.log(this._authState.currentUser);
  }

  getTasks = toSignal(
    (
      collectionData(this._query, { idField: 'id' }) as Observable<Task[]>
    ).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    { initialValue: [] }
  );

  getTask(id: string) {
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(task: TaskCreate) {
    return addDoc(this._collection, {...task, userId: this._authState.currentUser?.uid}); //Add doc in our collection
  }

  update(task: TaskCreate, id: string) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, {...task, userId: this._authState.currentUser?.uid});
  }

  delete(id: string){
    const docRef = doc(this._collection, id);
    return deleteDoc(docRef);
  }
}
