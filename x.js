const {PythonShell} = require("python-shell");
const py = new PythonShell('x.py');
py.send(JSON.stringify([1,2,3]))
py.on('message', function(m) {
console.log(m);
});
py.end(e=> {if (e) throw e;  console.log('e')})