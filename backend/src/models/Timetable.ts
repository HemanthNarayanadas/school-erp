import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface TimetableAttributes {
  id?: number;
  classId: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "10:00 AM"
  subjectId: number;
  teacherId: number;
}

export class Timetable extends Model<TimetableAttributes> implements TimetableAttributes {
  public id!: number;
  public classId!: number;
  public dayOfWeek!: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  public startTime!: string;
  public endTime!: string;
  public subjectId!: number;
  public teacherId!: number;
}

Timetable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Timetable',
    tableName: 'timetables',
    timestamps: true,
  }
);
