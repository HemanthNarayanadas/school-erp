import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export interface SettingsAttributes {
  id?: number;
  schoolName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  primaryColor: string;
  secondaryColor: string;
  principalName: string;
  principalMessage: string;
  principalPhotoUrl: string;
  academicYear: string;
  aboutIntroduction: string;
  aboutVision: string;
  aboutMission: string;
}

export class Settings extends Model<SettingsAttributes> implements SettingsAttributes {
  public id!: number;
  public schoolName!: string;
  public logoUrl!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public socialFacebook!: string;
  public socialTwitter!: string;
  public socialInstagram!: string;
  public socialLinkedin!: string;
  public primaryColor!: string;
  public secondaryColor!: string;
  public principalName!: string;
  public principalMessage!: string;
  public principalPhotoUrl!: string;
  public academicYear!: string;
  public aboutIntroduction!: string;
  public aboutVision!: string;
  public aboutMission!: string;
}

Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ABC International School',
    },
    logoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '123 Academic Street, Education Zone, City',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '+91 98765 43210',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'info@abcinternational.edu.in',
    },
    socialFacebook: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    socialTwitter: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    socialInstagram: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    socialLinkedin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#800000', // Maroon
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#FFD700', // Gold
    },
    principalName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Dr. Ramesh Kumar',
    },
    principalMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Welcome to our institution where we strive for academic excellence and holistic child development.',
    },
    principalPhotoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '2026-2027',
    },
    aboutIntroduction: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'ABC International School stands for academic rigor, social responsibility, and physical wellness.',
    },
    aboutVision: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'To cultivate a learning community of young minds who are innovative, compassionate, and ready to lead.',
    },
    aboutMission: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Providing quality value-based education using modern pedagogy and world-class infrastructure.',
    },
  },
  {
    sequelize,
    modelName: 'Settings',
    tableName: 'settings',
    timestamps: true,
  }
);
