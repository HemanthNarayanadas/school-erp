import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface UserAttributes {
  id?: number;
  name: string;
  username: string; // unique, used for login (could be ID/Roll number too)
  email?: string;
  passwordHash: string;
  role: 'principal' | 'teacher' | 'student' | 'parent';
  phone?: string;
  status?: 'active' | 'inactive';
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public username!: string;
  public email?: string;
  public passwordHash!: string;
  public role!: 'principal' | 'teacher' | 'student' | 'parent';
  public phone?: string;
  public status!: 'active' | 'inactive';
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('principal', 'teacher', 'student', 'parent'),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);
