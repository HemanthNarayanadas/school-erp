import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface SubjectAttributes {
  id?: number;
  name: string;
  code: string;
  classId: number;
}

export class Subject extends Model<SubjectAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public classId!: number;
}

Subject.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Subject',
    tableName: 'subjects',
    timestamps: true,
  }
);
