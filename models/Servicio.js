import { DataTypes } from "sequelize";          // Tipos de datos de Sequelize
import sequelize from "../db/connection.js";    // Conexión a la base de datos

// Modelo "Servicio" vinculado a la tabla "servicios"
const Servicio = sequelize.define(
  "Servicio",
  {
    // Nombre del servicio (obligatorio, máximo 150 caracteres)
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    // Descripción opcional del servicio (máximo 255 caracteres)
    descripcion: {
      type: DataTypes.STRING(255),
    },

    // Precio del servicio con dos decimales
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "servicios",       // Nombre de la tabla en la base de datos
    timestamps: true,             // Habilita timestamps
    createdAt: "created_at",      // Personaliza el nombre del campo createdAt
    updatedAt: false,             // No se usa updatedAt en esta tabla
  }
);

export default Servicio;           // Exporta el modelo para su uso en el sistema

