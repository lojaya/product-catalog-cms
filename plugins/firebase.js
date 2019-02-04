import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: 'AIzaSyDeCXwbGEfs_GsdmSXR77z4wO0ZFllMk3s',
    projectId: 'pulp-fiction-7effc'
};

// initialize your firebase app
firebase.initializeApp(config);

// save a reference to the firestore database
// to access it in the future
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true });

export {
    db,
    firebase
};
