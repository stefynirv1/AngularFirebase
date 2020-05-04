import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";


// aqui se agregan los campos
export interface Item { name: string; }

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  // para manipular los documentos
  private itemDoc: AngularFirestoreDocument<Item>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('items');
    // se guardan las colecciones
    this.items = this.itemsCollection.snapshotChanges().pipe(map(actions =>{
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return {id, ...data};

      });
    }));
   }
  //  Función
  listaItem() {
    return this.items;
  }
  agregarItem(item: Item){
    this.itemsCollection.add(item);
  }
  eliminarItem(item){
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`);
    this.itemDoc.delete();
  }
}
