
import Dexie from 'dexie';

const db = new Dexie('Tapes');
db.version(1).stores({ 
	recordings: 'id, title, created' 
});

export default db;
