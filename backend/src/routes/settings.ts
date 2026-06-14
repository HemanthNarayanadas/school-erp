import { Router, Request, Response } from 'express';
import { Settings, ActivityLog } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// Get settings - Public
router.get('/', async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Settings.create({
        schoolName: 'ABC International School',
        logoUrl: '',
        address: '123 Academic Street, Education Zone, City',
        phone: '+91 98765 43210',
        email: 'info@abcinternational.edu.in',
        socialFacebook: '',
        socialTwitter: '',
        socialInstagram: '',
        socialLinkedin: '',
        primaryColor: '#1e3a8a',
        secondaryColor: '#f59e0b',
        principalName: 'Dr. Anjali Sharma',
        principalMessage: 'Welcome to our school!',
        principalPhotoUrl: '',
        academicYear: '2026-2027',
        aboutIntroduction: 'Our school provides top education.',
        aboutVision: 'Empower students.',
        aboutMission: 'Provide quality guidance.',
      });
    }
    return res.json(settings);
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(500).json({ message: 'Error retrieving settings.' });
  }
});

// Update settings - Principal only
router.put('/', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings record not found.' });
    }

    await settings.update(req.body);

    // Create activity log
    await ActivityLog.create({
      userId: req.user!.id,
      action: 'UPDATE_SETTINGS',
      details: 'Updated school settings and content customization.',
    });

    return res.json({ message: 'Settings updated successfully.', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ message: 'Error updating settings.' });
  }
});

export default router;
