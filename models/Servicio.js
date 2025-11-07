import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Servicio = sequelize.define("Servicio", {
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: "servicios",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default Servicio;

