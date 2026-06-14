import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface TeacherAttributes {
  id?: number;
  userId: number;
  employeeId: string;
  qualifications: string;
  joiningDate?: Date;
}

export class Teacher extends Model<TeacherAttributes> implements TeacherAttributes {
  public id!: number;
  public userId!: number;
  public employeeId!: string;
  public qualifications!: string;
  public joiningDate!: Date;

  // Associations
  public user?: any;
}

Teacher.init(
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
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    qualifications: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joiningDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: true,
  }
);
