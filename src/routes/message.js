import { Router } from 'express';
import { sequelize } from '../models';

const router = Router();

router.get('/', async (req, res) => {
  const allMessages = await req.context.models.Message.findAll();
  res.send(allMessages);
});

router.get('/randomUnopened', async (req, res) => {
  const randomMessage = await req.context.models.Message.findOne({
    where: {
      is_open: false,
    },
    order: sequelize.random()
  });
  res.send(randomMessage);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Message.findByPk(req.params.messageId);
  res.send(message);
});

router.get('/conversationId/:conversationId', async (req, res) => {
  const message = await req.context.models.Message.findAll({
    where: {
      conversation_id: req.params.conversationId,
    },
    order: [
      ['createdAt', 'ASC'],
    ]
  });
  res.send(message);
});

router.post('/', async (req, res) => {
  const message = await req.context.models.Message.create({
    is_open: false,
    user_id: req.query.userId,
    url: req.query.url,
  });
  res.send(message);
});

router.put('/:messageId', async (req, res) => {
  var message = await req.context.models.Message.findByPk(req.params.messageId);
  if (message) {
    message = await req.context.models.Message.upsert({
      id: req.params.messageId,
      is_open: true,
      conversation_id: req.query.conversationId,
    }, {
      returning: true,
    });
  }
  res.send(message[0]);
})

router.delete('/:messageId', async (req, res) => {
  await req.context.models.Message.destroy({
    where: {
      id: req.params.messageId,
    }
  });
  res.sendStatus(200);
});

export default router;
