const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// 1. GET /api/notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. POST /api/notes
router.post('/notes', async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;
    const newNote = new Note({ title, content, isPinned });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. DELETE /api/notes/:id - Xóa ghi chú theo ID
router.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Không tìm thấy ghi chú' });
    }

    res.status(200).json({ message: 'Xóa thành công', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;