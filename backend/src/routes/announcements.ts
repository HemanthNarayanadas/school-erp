import { Router, Request, Response } from 'express';
import { Announcement, User } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// Get announcements - Public & Authenticated
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query; // 'all', 'teachers', 'students', 'parents', 'emergency'
    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    const announcements = await Announcement.findAll({
      where: filter,
      include: [{ model: User, as: 'user', attributes: ['name', 'role'] }],
      order: [['date', 'DESC']],
    });

    return res.json(announcements);
  } catch (error) {
    console.error('Fetch announcements error:', error);
    return res.status(500).json({ message: 'Error fetching announcements.' });
  }
});

// Create announcement
router.post('/', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  const { title, content, type } = req.body;

  if (!title || !content || !type) {
    return res.status(400).json({ message: 'Title, content, and type are required.' });
  }

  try {
    const announcement = await Announcement.create({
      title,
      content,
      type,
      date: new Date().toISOString().split('T')[0],
      createdBy: req.user!.id,
    });
    return res.status(201).json(announcement);
  } catch (error) {
    console.error('Create announcement error:', error);
    return res.status(500).json({ message: 'Error creating announcement.' });
  }
});

export default router;
