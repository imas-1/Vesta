import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

const itemsRef = collection(db, 'items')

export function subscribeToItems(userId, callback) {
  const q = query(itemsRef, where('userId', '==', userId))
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      callback(items)
    },
    (error) => {
      console.error('subscribeToItems error:', error)
      callback([])
    }
  )
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
