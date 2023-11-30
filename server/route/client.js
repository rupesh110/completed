import express from 'express';

const router = express.Router();

router.get('/add', (req, res) => {
    res.send({ hi: 'Cheeck this out' });
})

export default router;