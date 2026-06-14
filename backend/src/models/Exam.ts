import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface ExamAttributes {
  id?: number;
  name: string;
  type: string; // "Unit Test" | "Midterm" | "Final" | "Quarterly"
  date: string;
  maxMarks: number;
  classId: number;
  subjectId: number;
}

export class Exam extends Model<ExamAttributes> implements ExamAttributes {
  public id!: number;
  public name!: string;
  public type!: string;
  public date!: string;
  public maxMarks!: number;
  public classId!: number;
  public subjectId!: number;
}

Exam.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unit Test',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    maxMarks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Exam',
    tableName: 'exams',
    timestamps: true,
  }
);
