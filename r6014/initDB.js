import { load } from "./dist/sql-httpvfs.js";
window.loadDB = load

window.loadDB('/r6014/r6014-fts.sqlite3').then(db => {
  window.db = db.db
})