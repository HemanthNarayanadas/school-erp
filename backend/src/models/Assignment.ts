import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface AssignmentAttributes {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  classId: number;
  subjectId: number;
  filePath?: string; // For assignments or study materials download
  createdBy: number; // Teacher ID
}

export class Assignment extends Model<AssignmentAttributes> implements AssignmentAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public dueDate!: string;
  public classId!: number;
  public subjectId!: number;
  public filePath?: string;
  public createdBy!: number;
}

Assignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Assignment',
    tableName: 'assignments',
    timestamps: true,
  }
);
