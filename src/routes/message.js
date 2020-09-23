import { Router } from 'express';
import Message from '../models/message';
import passport, { use } from 'passport';
import Sequelize, { Op } from 'sequelize';
import User from '../models/user';
import BlockedUser from '../models/blockedUser';

const router = Router();
const sequelize = new Sequelize(process.env.DATABASE_URL);

router.get(
  '/randomUnopened',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    try {
      const blockedUsers = await BlockedUser.findAll({
        where: {
          user_id: user.id,
        },
        attributes: ['blocked_user_id'],
      });
      const blockedUserIds = blockedUsers.map(
        (record) => record.blocked_user_id
      );

      const randomUnopenedMessage = await Message.findOne({
        where: {
          is_open: false,
          [Op.and]: [
            {
              user_id: {
                [Op.notIn]: blockedUserIds,
              },
            },
            {
              user_id: {
                [Op.ne]: user.id,
              },
            },
          ],
        },
        order: sequelize.random(),
      });

      if (!randomUnopenedMessage)
        return res.status(404).send('No random unopened messages found');

      res.send(randomUnopenedMessage);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.get(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.messageId);
      if (!message) return res.status(404).send(`No message found`);
      res.send(message);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.get(
  '/withConversation/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const messages = await Message.findAll({
        where: {
          conversation_id: req.params.conversationId,
        },
        order: [['createdAt', 'ASC']],
      });
      res.send(messages);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { url } = req.body;
    if (!url) res.status(400).send('Missing url');
    try {
      const message = await Message.create({
        user_id: user.id,
        url: url,
      });
      res.send(message);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.post(
  '/withConversation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { url, conversationId } = req.body;
    if (!url || !conversationId)
      return res.status(400).send('Missing url or conversation id');
    try {
      const message = await Message.create({
        is_open: true,
        user_id: user.id,
        url: url,
        conversation_id: conversationId,
      });
      res.send(message);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.put(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { conversationId } = req.body;
    if (!conversationId) return res.status(400).send('Missing conversation id');

    try {
      const message = await Message.findByPk(req.params.messageId);
      if (!message) return res.status(404).send('Message not found');
      message.is_open = true;
      message.conversation_id = conversationId;
      await message.save();
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.delete(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Message.destroy({
        where: {
          id: req.params.messageId,
        },
      });
      res.status(200).send('Message deleted');
    } catch (e) {
      console.log(e);
      res.status(500).send('The specified message does not exist');
    }
  }
);

export default router;
