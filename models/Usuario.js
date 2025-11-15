import { DataTypes } from 'sequelize';          // Importa tipos de datos de Sequelize
import sequelize from '../db/connection.js';    // Conexión establecida a la BD

// Definición del modelo "Usuario" vinculado a la tabla "usuarios"
const Usuario = sequelize.define(
  'Usuario',
  {
    // ID autoincremental y llave primaria
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    // Nombre del usuario (obligatorio)
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    // Email único y obligatorio
    email: { 
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },

    // ID de Google (solo si el usuario inicia con Google OAuth)
    googleId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    // Contraseña cifrada (puede ser null si usa Google)
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    // Rol del usuario con valor por defecto "cliente"
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'cliente'
    },

    // Estado del usuario (activo/inactivo)
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'usuarios',   // Nombre de la tabla real
    timestamps: false        // No se usan createdAt ni updatedAt
  }
);

export default Usuario;      // Exporta el modelo para usarlo en controladores o relaciones

