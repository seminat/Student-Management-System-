import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../types';

export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, color, priority, isPinned } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        color,
        priority,
        isPinned: !!isPinned,
        userId: req.user.id,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Ensure the note belongs to the user
    const existingNote = await prisma.note.findUnique({ where: { id } });
    if (!existingNote || existingNote.userId !== req.user.id) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    const note = await prisma.note.update({
      where: { id },
      data,
    });

    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const existingNote = await prisma.note.findUnique({ where: { id } });
    if (!existingNote || existingNote.userId !== req.user.id) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    await prisma.note.delete({ where: { id } });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
