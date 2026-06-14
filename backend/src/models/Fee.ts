import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface FeeAttributes {
  id?: number;
  studentId: number;
  amount: number;
  title: string; // e.g. "Term 1 Tuition Fee"
  dueDate: string;
  status: 'paid' | 'unpaid';
  paidDate?: string;
  receiptNo?: string;
}

export class Fee extends Model<FeeAttributes> implements FeeAttributes {
  public id!: number;
  public studentId!: number;
  public amount!: number;
  public title!: string;
  public dueDate!: string;
  public status!: 'paid' | 'unpaid';
  public paidDate?: string;
  public receiptNo?: string;
}

Fee.init(
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Tuition Fee',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('paid', 'unpaid'),
      allowNull: false,
      defaultValue: 'unpaid',
    },
    paidDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    receiptNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Fee',
    tableName: 'fees',
    timestamps: true,
  }
);
