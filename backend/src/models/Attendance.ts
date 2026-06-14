import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface AttendanceAttributes {
  id?: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  remarks?: string;
  markedBy?: number; // Teacher ID
}

export class Attendance extends Model<AttendanceAttributes> implements AttendanceAttributes {
  public id!: number;
  public studentId!: number;
  public date!: string;
  public status!: 'present' | 'absent' | 'late';
  public remarks?: string;
  public markedBy?: number;
}

Attendance.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late'),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    markedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendances',
    timestamps: true,
  }
);
