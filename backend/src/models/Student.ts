import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface StudentAttributes {
  id?: number;
  userId: number;
  rollNumber: string;
  admissionId: string;
  classId: number;
  parentId?: number;
  dob?: Date;
  address?: string;
}

export class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: number;
  public userId!: number;
  public rollNumber!: string;
  public admissionId!: string;
  public classId!: number;
  public parentId?: number;
  public dob?: Date;
  public address?: string;
  
  // Associations
  public user?: any;
  public class?: any;
  public parent?: any;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admissionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
  }
);
