// models/Factura.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Factura = sequelize.define("Factura", {
  numero_factura: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  fecha_emision: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  impuestos: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('emitida','anulada','pagada'),
    allowNull: false,
    defaultValue: 'emitida'
  }
}, {
  tableName: "facturas",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

export default Factura;

