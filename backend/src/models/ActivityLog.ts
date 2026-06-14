import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface ActivityLogAttributes {
  id?: number;
  userId: number;
  action: string;
  details: string;
}

export class ActivityLog extends Model<ActivityLogAttributes> implements ActivityLogAttributes {
  public id!: number;
  public userId!: number;
  public action!: string;
  public details!: string;
}

ActivityLog.init(
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
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ActivityLog',
    tableName: 'activity_logs',
    timestamps: true,
    updatedAt: false, // Only createdAt is needed for logs
  }
);
