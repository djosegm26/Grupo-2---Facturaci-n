import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  googleId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'cliente'
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

export default Usuario;
