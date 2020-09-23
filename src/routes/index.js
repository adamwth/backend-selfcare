import auth from './auth';
import user from './user';
import journal from './journal';
import message from './message';
import conversation from './conversation';
import { Router } from 'express';
import db from '../config/database'; // Delete for production!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/* Delete for production!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
const index = Router();

index.post(
  '/reset',
  async (req, res) => {
    try {
      db.sync({ force: true })
      .catch((err) => console.log(err));
      res.send(200);
    } catch (e) {
      res.send(500);
    }
  }
);
/* Delete for production!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

export default {
  auth,
  user,
  journal,
  message,
  conversation,
  index, // Delete for production!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};
