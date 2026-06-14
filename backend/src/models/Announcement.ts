import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface AnnouncementAttributes {
  id?: number;
  title: string;
  content: string;
  type: 'all' | 'teachers' | 'students' | 'parents' | 'emergency';
  date: string;
  createdBy: number; // User ID
}

export class Announcement extends Model<AnnouncementAttributes> implements AnnouncementAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public type!: 'all' | 'teachers' | 'students' | 'parents' | 'emergency';
  public date!: string;
  public createdBy!: number;
}

Announcement.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('all', 'teachers', 'students', 'parents', 'emergency'),
      allowNull: false,
      defaultValue: 'all',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcements',
    timestamps: true,
  }
);
