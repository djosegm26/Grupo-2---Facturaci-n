import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Cliente = sequelize.define("Cliente", {
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  identificacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  direccion: {
    type: DataTypes.STRING(255),
  },
  email: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: "clientes",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default Cliente;

