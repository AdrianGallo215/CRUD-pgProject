import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [showProductos, setShowProductos] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [newNombre, setNewNombre] = useState('');
  const [newPrecio, setNewPrecio] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newNombre !== '' ? newNombre : nombre,
          precio: newPrecio !== '' ? parseFloat(newPrecio) : precio,
        }),
      });
      const updatedProducto = await response.json();
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === id ? { ...producto, ...updatedProducto } : producto
        )
      );
      setNewNombre('');
      setNewPrecio('');
      setSelectedProductId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProductos((prevProductos) =>
          prevProductos.filter((producto) => producto.id !== id)
        );
        setSelectedProductId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          precio: precio !== '' ? parseFloat(precio) : 0,
        }),
      });
      const nuevoProducto = await response.json();
      setProductos([...productos, nuevoProducto]);
      setNewNombre('');
      setNewPrecio('');
      setShowAddProductModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div>
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Gestión de Productos</h1>
    <button onClick={() => setShowProductos(!showProductos)}>
      {showProductos ? 'Ocultar Productos' : 'Mostrar Productos'}
    </button>
    <button onClick={() => setShowAddProductModal(true)}>Agregar Producto</button>
    {showProductos && (
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - {producto.precio}
            <button onClick={() => setSelectedProductId(producto.id)}>Modificar</button>
            <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    )}
    {selectedProductId !== null && (
      <div>
        <h2>Modificar Producto</h2>
        <label>Nuevo Nombre:</label>
        <input
          type="text"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
        />
        <label>Nuevo Precio:</label>
        <input
          type="text"
          value={newPrecio}
          onChange={(e) => setNewPrecio(e.target.value)}
        />
        <button onClick={() => handleUpdate(selectedProductId)}>Guardar Cambios</button>
      </div>
    )}
    {showAddProductModal && (
      <div>
      <div className="overlayStyle"></div>
      <div className="modalStyle">
        <h2>Agregar Producto</h2>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label>Precio:</label>
        <input
          type="text"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button onClick={handleCreate}>Agregar</button>
        <button onClick={() => setShowAddProductModal(false)}>Cancelar</button>
      </div>
      </div>
    )}
  </div>
  );
}

export default App;
