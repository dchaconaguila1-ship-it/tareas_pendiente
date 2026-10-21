const express = require('express');
const app = express();

app.use(express.json());

let tareas = [
  { titulo: 'Estudiar', descripcion: 'Repasar Express', estado: 'pendiente', pasos: ['Leer guia', 'Hacer ejercicio'] },
  { titulo: 'Comprar', descripcion: 'Ir al mercado', estado: 'completada', pasos: ['Hacer lista', 'Pagar'] }
];

const buscar = (titulo) =>
  tareas.find(t => t.titulo.toLowerCase() === titulo.toLowerCase());

app.get('/tareas', (req, res) => {
  res.status(200).json(tareas);
});

app.get('/tareas/pendientes', (req, res) => {
  res.status(200).json(tareas.filter(t => t.estado === 'pendiente'));
});

app.get('/tareas/completadas', (req, res) => {
  res.status(200).json(tareas.filter(t => t.estado === 'completada'));
});

app.get('/tareas/:titulo', (req, res) => {
  const tarea = buscar(req.params.titulo);
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada.' });
  res.status(200).json(tarea);
});

app.post('/tareas', (req, res) => {
  const { titulo, descripcion, estado, pasos } = req.body;
  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'titulo y descripcion son obligatorios.' });
  }
  if (buscar(titulo)) {
    return res.status(400).json({ error: 'Ya existe una tarea con ese titulo.' });
  }
  const nueva = {
    titulo,
    descripcion,
    estado: estado === 'completada' ? 'completada' : 'pendiente',
    pasos: Array.isArray(pasos) ? pasos : []
  };
  tareas.push(nueva);
  res.status(200).json(nueva);
});

app.put('/tareas/:titulo', (req, res) => {
  const tarea = buscar(req.params.titulo);
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada.' });

  const { titulo, descripcion, pasos } = req.body;
  if (!titulo && !descripcion && !pasos) {
    return res.status(400).json({ error: 'Envia titulo, descripcion o pasos.' });
  }
  if (titulo) tarea.titulo = titulo;
  if (descripcion) tarea.descripcion = descripcion;
  if (Array.isArray(pasos)) tarea.pasos = pasos;
  res.status(200).json(tarea);
});

app.patch('/tareas/:titulo/estado', (req, res) => {
  const tarea = buscar(req.params.titulo);
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada.' });

  const { estado } = req.body;
  if (estado !== 'pendiente' && estado !== 'completada') {
    return res.status(400).json({ error: "estado debe ser 'pendiente' o 'completada'." });
  }
  tarea.estado = estado;
  res.status(200).json(tarea);
});

app.delete('/tareas/:titulo', (req, res) => {
  const tarea = buscar(req.params.titulo);
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada.' });

  tareas = tareas.filter(t => t !== tarea);
  res.status(200).json({ message: 'Tarea eliminada correctamente.' });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});