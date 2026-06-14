import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface EventAttributes {
  id?: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
}

export class Event extends Model<EventAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public date!: string;
  public location!: string;
  public imageUrl?: string;
}

Event.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
  }
);
