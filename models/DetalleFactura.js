// models/DetalleFactura.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

// Modelo para almacenar cada línea o ítem asociado a una factura
const DetalleFactura = sequelize.define("DetalleFactura", {

  // ID de la factura a la que pertenece este detalle
  factura_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // ID del producto (cuando el detalle corresponde a un producto)
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // ID del servicio (cuando el detalle corresponde a un servicio)
  servicio_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Descripción opcional del ítem facturado
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  // Cantidad del producto o servicio
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },

  // Precio unitario del ítem
  precio_unitario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  // Subtotal = cantidad * precio_unitario
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }

}, {
  tableName: "detalle_factura",   // Nombre de la tabla en la BD
  timestamps: true,               // Incluye fecha de creación
  createdAt: "created_at",        // Nombre personalizado del campo createdAt
  updatedAt: false                // No se usa updatedAt para esta tabla
});

export default DetalleFactura;


