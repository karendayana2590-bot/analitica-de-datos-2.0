'use strict';
let python=null;
const CDN='https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
self.onmessage=async({data})=>{
  if(data.type==='init'){
    try{
      self.postMessage({type:'status',message:'Descargando Python…'});
      importScripts(CDN+'pyodide.js');
      python=await loadPyodide({indexURL:CDN});
      self.postMessage({type:'status',message:'Preparando pandas…'});
      await python.loadPackage('pandas');
      python.FS.writeFile('produccion.csv',data.csv,{encoding:'utf8'});
      await python.runPythonAsync(`
import ast, contextlib, io, json, traceback
def _evaluate_cell(code, prepare):
    scope = {"__name__": "__main__"}
    stream = io.StringIO()
    try:
        with contextlib.redirect_stdout(stream), contextlib.redirect_stderr(stream):
            if prepare:
                exec(compile(prepare, "preparacion", "exec"), scope)
            tree = ast.parse(code, filename="tu_codigo")
            value = None
            if tree.body and isinstance(tree.body[-1], ast.Expr):
                exec(compile(ast.Module(body=tree.body[:-1], type_ignores=[]), "tu_codigo", "exec"), scope)
                value = eval(compile(ast.Expression(tree.body[-1].value), "tu_codigo", "eval"), scope)
            else:
                exec(compile(tree, "tu_codigo", "exec"), scope)
        import pandas as pd
        result = {"ok": True, "stdout": stream.getvalue()[:10000], "value": "", "html": "", "truncated": len(stream.getvalue()) > 10000}
        if isinstance(value, pd.DataFrame):
            result["html"] = value.head(50).to_html(escape=True)
            result["truncated"] = result["truncated"] or len(value) > 50
        elif isinstance(value, pd.Series):
            result["value"] = str(value.head(50))
            result["truncated"] = result["truncated"] or len(value) > 50
        elif value is not None:
            result["value"] = str(value)[:10000]
        return json.dumps(result, ensure_ascii=False)
    except Exception:
        return json.dumps({"ok": False, "error": traceback.format_exc()[-10000:]}, ensure_ascii=False)
`);
      self.postMessage({type:'ready'});
    }catch(e){self.postMessage({type:'init-error',message:String(e)});}
  }
  if(data.type==='run'){
    if(!python){self.postMessage({type:'result',id:data.id,result:{ok:false,error:'Python todavía no está disponible.'}});return;}
    try{
      python.globals.set('user_code',data.code);
      python.globals.set('prepare_code',data.prepare||'');
      const raw=await python.runPythonAsync('_evaluate_cell(user_code, prepare_code)');
      python.globals.delete('user_code');python.globals.delete('prepare_code');
      self.postMessage({type:'result',id:data.id,result:JSON.parse(raw)});
    }catch(e){self.postMessage({type:'result',id:data.id,result:{ok:false,error:String(e)}});}
  }
};
