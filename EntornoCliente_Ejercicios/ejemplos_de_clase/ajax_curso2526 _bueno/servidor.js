// Importamos las librerías necesarias:

// Framework para crear servidores web en Node.js
const express = require('express'); 
// Cliente para conectar con base de datos MySQL
const mysql = require('mysql2');    
// Middleware para habilitar CORS (compartir recursos entre dominios)
const cors = require('cors');       

// Creamos la instancia de la app Express
const app = express(); 

// Middleware para permitir peticiones desde otro origen 
app.use(cors());

// para que el servidor pueda entender peticiones con JSON en el cuerpo de la petición
app.use(express.json());

// Configuramos la conexión a la base de datos MySQL como un objeto
const db = mysql.createConnection({
  host: 'localhost',          
  user: 'root',         
  password: '',  
  database: 'bdusuarios' 
});

// ========================
//  ENDPOINTS CRUD
// ========================

// método get (obtener todos)
/*  Intentamos conectar el objeto de bd mediante el metodo connect(callback)
    creado con MySQL y verificamos si hay errores
    este método o función devuelve undefined, 
    inicia la conexión de manera asíncrona, y cuando termina, 
    ejecuta la función callback, es decir, 
    el resultado (éxito o error) se recibe en la callback,
    es decir, cuando termina connect devuelve:
    null en err si se ha establecido la conexión correctamente
    objeto con los datos del error si  hay fallo de conexión
*/
db.connect(err => {
  if (err) {
    console.error('Error al conectar con MySQL:', err); // Si hay error, se muestra
    return; // Salimos para no seguir ejecutando si no conecta
  }
  console.log('Conectado a MySQL'); // mensaje de confirmación en caso de éxito
});

/*  Definir endpoint para obtener los usuarios almacenados en la base de datos
    mediante el método app.get(ruta, callback);
    ruta:	Es la URL en la que se quiere escuchar (ejs: /usuarios o /productos/:id)
    callback(req, res)	Es una función que se ejecuta cuando llega una 
                        petición GET a esa ruta, que recibe dos objetos importantes:
            req → el objeto request (la solicitud del cliente).
            res → el objeto response (la respuesta que enviarás al cliente)
*/
app.get('/api/usuarios', (req, res) => {
  const sql = 'SELECT * FROM usuarios'; 
  /* Ejecutamos la consulta a la base de datos con db.query(sql, [valores], callback);
    sql → una cadena con la consulta SQL (por ejemplo "SELECT * FROM usuarios").
    valores (opcional) → un array con los valores que se reemplazarán 
                     en la consulta (para evitar inyecciones SQL)
    callback → una función que se ejecuta cuando MySQL termina de procesar la consulta.
*/
  db.query(sql, (err, results) => {
    if (err) {
      // Si ocurre un error, enviamos un estado 500 y el mensaje de error en JSON
      return res.status(500).json({ error: err.message });
    }
    // Si todo va bien, enviamos los resultados en formato JSON
    res.json(results);
  });
});

// Método GET para obtener un usuario específico por su ID
app.get('/api/usuarios/:id', (req, res) => {
  // Extraemos el parámetro 'id' de la URL
  const { id } = req.params;
  /* Consulta SQL con parámetro para evitar inyecciones SQL con el método db.query
Recibe tres parámetros:
  La consulta SQL: 'SELECT * FROM usuarios WHERE id = ?'.     Usamos un placeholder ?, que será reemplazado por un valor seguro para 
                    evitar inyecciones SQL.
  Los valores a reemplazar en los placeholders: [id].Se está pasando array 
                    con el único valor: el id a buscar.
  Callback: (err, results) => { ... }. Es una función que se ejecuta cuando 
                    la consulta termina. Recibe:
                        err: contiene información sobre cualquier error 
                             que ocurra durante la consulta.
                        results: es un array con los resutados de la consulta, 
                        donde cada fila de la tabla es un objeto.
*/
  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) 
      // Si ocurre un error, respuesta con código 500 y mensaje del error
      return res.status(500).json({ error: err.message });
    if (results.length === 0) 
      // Si no se encuentra ningún usuario con ese ID, respondemos con código 404
      return res.status(404).json({ message: 'Usuario no encontrado' });
    // Si no hay error, se devuelve el primer usuario encontrado (ya que ID es único)
    res.json(results[0]);
  });
});

// Método POST para crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  // Obtenemos los datos enviados en el cuerpo de la petición
  const { nombre, telefono, email } = req.body;
  // Validamos que los campos obligatorios estén presentes
  if (!nombre || !email) 
    return res.status(400).json({ message: 'Nombre y email son obligatorios' });
  // Consulta SQL para insertar un nuevo usuario usando placeholders para seguridad
  const sql = 'INSERT INTO usuarios (nombre, telefono, email) VALUES (?, ?, ?)';
  // Ejecutamos la consulta
  db.query(sql, [nombre, telefono, email], (err, result) => {
    if (err) 
      // Si ocurre un error en la inserción, respondemos con código 500
      return res.status(500).json({ error: err.message });
    // Devolvemos los datos del usuario creado, incluyendo el ID generado automáticamente
    res.status(201).json({ id: result.insertId, nombre, telefono, email });
  });
});

// Método PUT para actualizar un usuario existente
app.put('/api/usuarios/:id', (req, res) => {
  // Obtenemos el ID del usuario a actualizar desde los parámetros de la URL
  const { id } = req.params;
  /* Obtenemos los datos a actualizar desde el cuerpo de la petición
  req.body contiene los datos enviados en el cuerpo de la petición, 
  generalmente en formato JSON.
  Usamos destructuración para sacar directamente las variables nombre, telefono y email.
  */
  const { nombre, telefono, email } = req.body;
  // Consulta SQL para actualizar el usuario con placeholders
  const sql = 'UPDATE usuarios SET nombre = ?, telefono = ?, email = ? WHERE id = ?';
  // Ejecutamos la consulta de actualización
  db.query(sql, [nombre, telefono, email, id], (err, result) => {
    if (err) 
      // Si ocurre un error en la actualización, respondemos con código 500
      return res.status(500).json({ error: err.message });
    // Confirmamos que la actualización se realizó correctamente
    res.json({ message: 'Usuario actualizado correctamente' });
  });
});

// Método DELETE para eliminar un usuario por su ID
app.delete('/api/usuarios/:id', (req, res) => {
  // Obtenemos el ID del usuario a eliminar desde los parámetros de la URL
  const { id } = req.params;
  // Consulta SQL para eliminar el usuario con el ID especificado
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) 
      // Si ocurre un error en la eliminación, respondemos con código 500
      return res.status(500).json({ error: err.message });
    // Confirmamos que el usuario fue eliminado correctamente
    res.json({ message: 'Usuario eliminado correctamente' });
  });
});

// Iniciamos el servidor y lo ponemos a escuchar en el puerto 3000
app.listen(3000, () => console.log('Servidor escuchando en http://localhost:3000')
);