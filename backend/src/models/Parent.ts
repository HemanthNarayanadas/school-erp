import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface ParentAttributes {
  id?: number;
  userId: number;
  occupation: string;
  address?: string;
}

export class Parent extends Model<ParentAttributes> implements ParentAttributes {
  public id!: number;
  public userId!: number;
  public occupation!: string;
  public address?: string;

  // Associations
  public user?: any;
  public children?: any;
}

Parent.init(
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
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Parent',
    tableName: 'parents',
    timestamps: true,
  }
);
