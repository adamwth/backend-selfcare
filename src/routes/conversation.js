import { Router } from 'express';
import { Op } from 'sequelize';
import Conversation from '../models/conversation';
import passport from 'passport';

const router = Router();

router.get(
  '/withUser',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const allUserConversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          {
            first_user_id: {
              [Op.eq]: user.id,
            },
          },
          {
            second_user_id: {
              [Op.eq]: user.id,
            },
          },
        ],
      },
    });
    res.send(allUserConversations);
  }
);

router.get(
  '/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const conversation = await Conversation.findByPk(req.params.conversationId);
    res.send(conversation);
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { secondUserId } = req.body;
    const conversation = await Conversation.create({
      first_user_id: user.id,
      second_user_id: secondUserId,
    });
    res.send(conversation);
  }
);

router.delete(
  '/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await Conversation.destroy({
        where: {
          id: req.params.conversationId,
        },
      });
      res.status(200).send('Conversation deleted');
    } catch (e) {
      console.log(e);
      res.status(500).send('The specified conversation does not exist');
    }
  }
);

export default router;
