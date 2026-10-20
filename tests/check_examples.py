"""Comprueba el evaluador y los ejemplos de la clase con pandas real."""
from pathlib import Path
import os,json,re,unittest
import pandas as pd
ROOT=Path(__file__).resolve().parent.parent
source=(ROOT/'python-worker.js').read_text(encoding='utf-8')
engine=re.search(r'await python\.runPythonAsync\(`\n(.*?)`\);',source,re.S).group(1)
scope={};exec(engine,scope)
evaluate=scope['_evaluate_cell']
examples=json.loads((ROOT/'tests/examples.json').read_text(encoding='utf-8'))
os.chdir(ROOT/'data')
class LessonExamples(unittest.TestCase):
    def test_all_examples(self):
        for e in examples:
            with self.subTest(example=e['id']):
                result=json.loads(evaluate(e['code'],e['prepare']))
                self.assertTrue(result['ok'],result.get('error'))
    def test_case_results(self):
        df=pd.read_csv('produccion.csv')
        self.assertEqual(df.shape,(8,10))
        self.assertEqual(df[df['turno']=='A']['id'].tolist(),[1,3,5,7])
        self.assertEqual(df[df['turno']=='B']['id'].tolist(),[2,4,6,8])
        self.assertEqual(df[df['cantidad']>=120]['id'].tolist(),[5,7,8])
        self.assertEqual(df['cantidad'].sum(),880)
        self.assertFalse(pd.api.types.is_datetime64_any_dtype(df['fecha']))
    def test_errors_are_visible(self):
        cases=[('df["produccion"]','KeyError'),('df.shape()','TypeError'),('DF.head()','NameError'),('df[df["turno"] = "A"]','SyntaxError'),('pd.read_csv("no_existe.csv")','FileNotFoundError')]
        for code,kind in cases:
            with self.subTest(kind=kind):
                result=json.loads(evaluate(code,'import pandas as pd\ndf = pd.read_csv("produccion.csv")'))
                self.assertFalse(result['ok']);self.assertIn(kind,result['error'])
    def test_stdout_and_table_results(self):
        a=json.loads(evaluate('print(100 == 100)',''))
        self.assertEqual(a['stdout'],'True\n')
        b=json.loads(evaluate('df.head(3)','import pandas as pd\ndf = pd.read_csv("produccion.csv")'))
        self.assertIn('<table',b['html']);self.assertIn('cantidad',b['html'])
    def test_large_output_and_text_escaping(self):
        r=json.loads(evaluate('pd.DataFrame({"x":range(100)})','import pandas as pd'))
        self.assertTrue(r['truncated'])
        r=json.loads(evaluate('pd.DataFrame({"x":["<script>dato</script>"]})','import pandas as pd'))
        self.assertIn('&lt;script&gt;',r['html']);self.assertNotIn('<script>',r['html'])
if __name__=='__main__':unittest.main(verbosity=2)
