let {PythonShell} = require('python-shell')
let py = new PythonShell('./src/py/read.py')
const Enmap = require('enmap')
const db = new Enmap({name: 'database'})

db.set("te", "testing")

console.log(db)