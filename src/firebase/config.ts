import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore' 
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: 'AIzaSyDn534qtA2GLw40GojN0Nw07cRIDGBENt0',
    authDomain: 'splatgame-bf878.firebaseapp.com',
    projectId: 'splatgame-bf878',
    storageBucket: 'splatgame-bf878.firebasestorage.app',
    messagingSenderId: '608670444190',
    appId: '1:608670444190:web:9b0b593c0e5ccb1bc8298f',
    measurementId: 'G-YB1JSQP9NG'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app) 
const analytics = getAnalytics(app)

export { app, auth, db, analytics }