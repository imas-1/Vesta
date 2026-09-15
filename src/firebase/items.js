import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

const itemsRef = collection(db, 'items')

export function subscribeToItems(userId, callback) {
  const q = query(itemsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(items)
  })
}

export async function addItem(userId, data) {
  await addDoc(itemsRef, {
    ...data,
    userId,
    createdAt: serverTimestamp()
  })
}

export async function updateItem(itemId, data) {
  await updateDoc(doc(db, 'items', itemId), data)
}

export async function deleteItem(itemId) {
  await deleteDoc(doc(db, 'items', itemId))
}

export const CATEGORIES = [
  'Tricouri',
  'Camasi',
  'Hanorace',
  'Pulovere',
  'Pantaloni',
  'Blugi',
  'Pantaloni scurti',
  'Geci',
  'Incaltaminte',
  'Accesorii',
  'Altele'
]
