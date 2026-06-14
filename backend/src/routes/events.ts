import { Router, Request, Response } from 'express';
import { Event } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// Get events - Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll({ order: [['date', 'ASC']] });
    return res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return res.status(500).json({ message: 'Error fetching events.' });
  }
});

// Create event - Principal only
router.post('/', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { title, description, date, location, imageUrl } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: 'All fields are required (title, description, date, location).' });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      imageUrl: imageUrl || '',
    });
    return res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Error creating event.' });
  }
});

export default router;
