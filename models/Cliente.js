import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

// Definición del modelo "Cliente" asociado a la tabla "clientes"
const Cliente = sequelize.define("Cliente", {
  
  // Nombre del cliente (obligatorio)
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  // Identificación única del cliente
  identificacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

  // Teléfono de contacto
  telefono: {
    type: DataTypes.STRING(20),
  },

  // Dirección física
  direccion: {
    type: DataTypes.STRING(255),
  },

  // Correo electrónico
  email: {
    type: DataTypes.STRING(100),
  },

}, {
  tableName: "clientes",     // Nombre real de la tabla en la BD
  timestamps: true,          // Habilita columnas de timestamps
  createdAt: "created_at",   // Nombre personalizado para createdAt
  updatedAt: false,          // No se utiliza updatedAt en esta tabla
});

export default Cliente;


