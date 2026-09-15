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

const outfitsRef = collection(db, 'outfits')

export function subscribeToOutfits(userId, callback) {
  const q = query(outfitsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const outfits = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(outfits)
  })
}

export async function addOutfit(userId, data) {
  await addDoc(outfitsRef, {
    ...data,
    userId,
    createdAt: serverTimestamp()
  })
}

export async function updateOutfit(outfitId, data) {
  await updateDoc(doc(db, 'outfits', outfitId), data)
}

export async function deleteOutfit(outfitId) {
  await deleteDoc(doc(db, 'outfits', outfitId))
}
