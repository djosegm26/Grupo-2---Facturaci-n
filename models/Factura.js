// models/Factura.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

// Modelo que representa la factura principal
const Factura = sequelize.define("Factura", {

  // Número único de la factura
  numero_factura: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },

  // Fecha en que se emite la factura
  fecha_emision: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  // ID del cliente asociado a la factura
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // ID del usuario que generó la factura
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Suma total antes de impuestos
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  // Valor de impuestos aplicados
  impuestos: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0.00
  },

  // Total final de la factura (subtotal + impuestos)
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  // Estado de la factura: emitida, anulada o pagada
  estado: {
    type: DataTypes.ENUM('emitida','anulada','pagada'),
    allowNull: false,
    defaultValue: 'emitida'
  }

}, {
  tableName: "facturas",      // Nombre real de la tabla
  timestamps: true,           // Registra createdAt
  createdAt: "created_at",    // Nombre personalizado
  updatedAt: false            // No se usa updatedAt
});

export default Factura;


