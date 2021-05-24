import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../_models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private _clientsColletion: AngularFirestoreCollection<Client>;
  private _clients: Observable<Client[]>;
  constructor(db: AngularFirestore) {
    this._clientsColletion = db.collection<Client>('Clients');
    this._clients = this._clientsColletion.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getClients() {
    return this._clients;
  }

  updateClient(client: Client, id: string) {
    return this._clientsColletion.doc(id).update(client);
  }

  addClient(client: Client) {
    return this._clientsColletion.add(client);
  }

  removeClient(id: string) {
    return this._clientsColletion.doc(id).delete();
  }
}
