import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface MarkAttributes {
  id?: number;
  studentId: number;
  examId: number;
  subjectId: number;
  marksObtained: number;
  remarks?: string;
  enteredBy?: number; // Teacher ID
}

export class Mark extends Model<MarkAttributes> implements MarkAttributes {
  public id!: number;
  public studentId!: number;
  public examId!: number;
  public subjectId!: number;
  public marksObtained!: number;
  public remarks?: string;
  public enteredBy?: number;
}

Mark.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    marksObtained: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enteredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Mark',
    tableName: 'marks',
    timestamps: true,
  }
);
