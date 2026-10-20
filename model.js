(function (root) {
  'use strict';
  const columns = ['id','fecha','producto','linea','turno','cantidad','defectuosas','tiempo_min','parada_min','costo'];
  function filterRows(rows, turn, minimum) {
    const n = minimum === '' || minimum == null ? -Infinity : Number(minimum);
    if (!Number.isFinite(n) && n !== -Infinity) return [];
    return rows.filter(r => (!turn || turn === 'todos' || r.turno === turn) && r.cantidad >= n);
  }
  function parseIds(value) {
    const text = String(value).trim();
    if (!text) return [];
    const tokens = text.split(/[\s,;]+/);
    if(tokens.some(v=>!/^\d+$/.test(v)))return null;
    return tokens.map(Number);
  }
  function sameIds(a,b) {
    return Array.isArray(a) && a.length===b.length && new Set(a).size===a.length && a.slice().sort((x,y)=>x-y).every((n,i)=>n===b.slice().sort((x,y)=>x-y)[i]);
  }
  function checkGuided(answers) {
    return [
      {key:'rows',ok:String(answers.rows).trim()==='8',explanation:'Hay ocho registros, uno por lote. La cantidad producida es otra variable.'},
      {key:'cols',ok:String(answers.cols).trim()==='10',explanation:'Hay diez campos. El índice que aparece a la izquierda no agrega una columna al archivo.'},
      {key:'ids',ok:sameIds(parseIds(answers.ids),[1,3,5,7]),explanation:'El turno A conserva ids 1, 3, 5 y 7. La comparación revisa cada fila.'},
      {key:'date',ok:answers.date==='texto',explanation:'read_csv lee aquí fecha como texto. La conversión a fecha se estudia en preparación de datos.'}
    ];
  }
  function errorHelp(error) {
    if(/KeyError/.test(error))return 'El nombre de la columna no coincide. Revisa df.columns y usa "cantidad", respetando sus letras. Las comillas no corrigen un nombre inexistente.';
    if(/NameError/.test(error))return 'Python no reconoce un nombre. Comprueba mayúsculas y ejecuta la preparación indicada. pd y df deben existir antes de usarlos.';
    if(/FileNotFoundError/.test(error))return 'El archivo no está en la ruta indicada. En este laboratorio se llama produccion.csv. En tu equipo debes ubicarlo junto al cuaderno o escribir su ruta correcta.';
    if(/SyntaxError|IndentationError/.test(error))return 'Revisa la línea indicada, las comillas rectas y los paréntesis. = asigna un valor y == compara. No agregues espacios al inicio de una línea si no pertenece a un bloque.';
    if(/TypeError/.test(error)&&/callable/.test(error))return 'Una propiedad se está usando como una función. df.shape no lleva paréntesis. df.head() sí ejecuta una operación y los necesita.';
    if(/ModuleNotFoundError/.test(error))return 'La biblioteca todavía no está disponible. Reinicia Python en el laboratorio. En Jupyter o Colab revisa la instalación del entorno que realmente estás usando.';
    return 'Lee la última línea del error y revisa la primera instrucción que cambiaste. Compara el archivo y los nombres con el ejemplo. Puedes restaurar el ejemplo y modificar una sola parte por vez.';
  }
  const api = {columns,filterRows,parseIds,sameIds,checkGuided,errorHelp};
  root.LessonModel=Object.freeze(api);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
