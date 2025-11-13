// models/DetalleFactura.js
import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const DetalleFactura = sequelize.define("DetalleFactura", {
  factura_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  servicio_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  tableName: "detalle_factura",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

export default DetalleFactura;

