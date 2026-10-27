import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const safeUser = u => ({ _id: u._id, name: u.name, email: u.email, role: u.role });
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req,res,next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (name.length < 2 || name.length > 80) return res.status(400).json({message:'Name must be between 2 and 80 characters.'});
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({message:'Enter a valid email address.'});
    if (password.length < 6 || password.length > 128) return res.status(400).json({message:'Password must be 6–128 characters.'});
    if (await User.exists({email})) return res.status(409).json({message:'An account with this email already exists.'});
    const passwordHash = await bcrypt.hash(password, 12);
    const isAdmin = email === String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const user = await User.create({name,email,passwordHash,role:isAdmin?'admin':'user'});
    res.status(201).json({user:safeUser(user),token:makeToken(user._id)});
  } catch(e) { next(e); }
});
router.post('/login', async (req,res,next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findOne({email}).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password,user.passwordHash))) return res.status(401).json({message:'Email or password is incorrect.'});
    res.json({user:safeUser(user),token:makeToken(user._id)});
  } catch(e) { next(e); }
});
router.get('/me', protect, (req,res) => res.json({user:safeUser(req.user)}));
export default router;
