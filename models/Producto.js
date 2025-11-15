import { DataTypes } from "sequelize";          // Tipos de datos provistos por Sequelize
import sequelize from "../db/connection.js";    // Conexión configurada a la base de datos

// Modelo "Producto" mapeado a la tabla "productos"
const Producto = sequelize.define(
  "Producto",
  {
    // Nombre del producto (requerido, hasta 150 caracteres)
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    // Descripción opcional del producto (hasta 255 caracteres)
    descripcion: {
      type: DataTypes.STRING(255),
    },

    // Precio unitario del producto; formato decimal con 2 decimales
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    // Cantidad en inventario (entero, requerido)
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "productos",       // Nombre explícito de la tabla en la BD
    timestamps: true,             // Habilita timestamps (createdAt por defecto)
    createdAt: "created_at",      // Renombra createdAt a created_at
    updatedAt: false,             // No se utiliza updatedAt en esta tabla
  }
);

export default Producto;          // Exporta el modelo para usarlo en otras partes del proyecto



