# Analítica de datos 2.0

Clase interactiva de la unidad 2: Series y DataFrames con pandas para estudiantes y docentes que empiezan a trabajar con tablas en Python.

## Orden de estudio

Primero se estudian los fundamentos de la [clase existente de introducción a Python](https://karendayana2590-bot.github.io/1682913-ANAL-TICA-DE-DATOS/): entorno y celdas, variables y tipos, listas y diccionarios, e importación de bibliotecas. Esta clase de pandas va después. Los bloques avanzados de NumPy, tablas e indicadores del aula anterior pueden retomarse como ampliación.

La [guía docente del aula anterior](https://github.com/karendayana2590-bot/1682913-ANAL-TICA-DE-DATOS/blob/main/clase-python/GUIA_DOCENTE.md) distribuye sus contenidos en tres encuentros de cuatro horas. El orden recomendado responde a los prerrequisitos de sus bloques, sin exigir terminar un proyecto avanzado antes de empezar pandas.

## Aprendizaje

El recorrido tiene 14 tramos: situación industrial, datos y registros, lectura de sintaxis, importación, Series, DataFrames, CSV, inspección, tipos, selección, filtros, práctica acompañada, reto y cierre. Incluye 18 ejemplos editables de Python, un explorador visual, preguntas con retroalimentación y autoevaluación. El modo docente contiene preparación, respuestas y guion de 120 minutos. Se añaden 120 minutos de trabajo independiente.

Cada ejemplo explica la pregunta, las líneas de código, el resultado esperado, su interpretación, errores frecuentes y una posible decisión. Los ocho registros son simulados y corresponden a lotes de 60 minutos programados. No respaldan decisiones sobre una empresa real.

## Uso del sitio

Abre la página publicada con GitHub Pages. El explorador visual y las preguntas funcionan sin cargar Python. Al pulsar **Activar Python**, se descarga Pyodide y pandas desde el CDN indicado en `python-worker.js`. El código se ejecuta en un Web Worker del navegador; **Detener Python** interrumpe una ejecución y permite reiniciar.

La preparación de cada ejercicio es visible en su laboratorio. Cada ejecución empieza con esa preparación, de modo que los ejemplos son independientes. En un cuaderno se deben ejecutar las celdas en orden. El sitio diferencia las selecciones visuales de las ejecuciones reales de Python.

El avance, las respuestas y el código editado se conservan en el almacenamiento local del navegador. No existe una base de datos de alumnos ni una recepción automática de entregas. **Guardar mi trabajo** descarga un registro en Markdown. Los tramos marcados representan revisión personal, no una certificación.

## Cuaderno y datos

- `data/produccion.csv`: ocho registros y diez campos.
- `cuadernos/Clase_1_pandas_desde_cero.ipynb`: conceptos, ejemplos con salidas comprobadas, práctica y solución del reto. La primera celda crea el CSV si no existe en la carpeta actual, sin sobrescribir un archivo existente.
- `lesson.js`: contenido pedagógico y datos del caso.
- `model.js`: reglas de selección y comprobación de respuestas.
- `app.js`, `python-worker.js` y `styles.css`: interfaz y laboratorio.

## Publicación en GitHub Pages

En Settings, Pages, selecciona **Deploy from a branch**, rama **main** y carpeta **/(root)**. El archivo `.nojekyll` permite publicar estos recursos estáticos directamente. La dirección de Pages se confirma cuando GitHub termina el despliegue. La publicación no necesita Node, Python de servidor ni una clave de API.

## Ejecución local

Desde la carpeta del proyecto:

```text
python -m http.server 8000
```

Abre `http://localhost:8000`. Se recomienda usar un servidor HTTP para que el navegador pueda crear el Worker. Al abrir el HTML como archivo local, el navegador puede bloquear el laboratorio. El resto de las interacciones visuales no depende de pandas.

## Comprobaciones

```text
node --test tests/model.test.cjs
python -m pip install pandas
python tests/check_examples.py
```

Las pruebas verifican selección por turno y umbral, fronteras, respuestas incompletas, los ejemplos y errores del evaluador. El cuaderno se ejecutó desde un espacio de nombres nuevo al prepararlo. Las pruebas de interfaz se documentan en `VERIFICACION.md` con su alcance real.

## Fuentes

[Estructuras de pandas](https://pandas.pydata.org/docs/getting_started/intro_tutorials/01_table_oriented.html), [lectura de archivos](https://pandas.pydata.org/docs/getting_started/intro_tutorials/02_read_write.html), [selección de datos](https://pandas.pydata.org/docs/getting_started/intro_tutorials/03_subset_data.html) y [Pyodide](https://pyodide.org/en/stable/usage/quickstart.html).

