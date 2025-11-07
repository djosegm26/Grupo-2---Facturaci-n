import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Producto = sequelize.define("Producto", {
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
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "productos",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default Producto;

