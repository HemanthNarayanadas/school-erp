import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface ClassAttributes {
  id?: number;
  name: string; // e.g. "Class 10"
  section: string; // e.g. "A"
  teacherId?: number; // Class Teacher
}

export class Class extends Model<ClassAttributes> implements ClassAttributes {
  public id!: number;
  public name!: string;
  public section!: string;
  public teacherId?: number;
}

Class.init(
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
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: true,
  }
);
