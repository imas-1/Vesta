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

const outfitsRef = collection(db, 'outfits')

export function subscribeToOutfits(userId, callback) {
  const q = query(outfitsRef, where('userId', '==', userId))
  return onSnapshot(
    q,
    (snapshot) => {
      const outfits = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      outfits.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      callback(outfits)
    },
    (error) => {
      console.error('subscribeToOutfits error:', error)
      callback([])
    }
  )
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
