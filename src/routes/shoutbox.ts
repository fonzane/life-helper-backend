import express from 'express';
import MessageModel, { Message } from '../models/Message';
const router = express.Router();


// !!!ToDo prevent API abuse!!! (add user validation)
router.get(
    '/messages',
    async (req: express.Request, res: express.Response) => {
        const messages = await MessageModel.find({},{}, {limit: 10});
        res.json(messages);
    }
)

// !!!ToDo prevent API abuse!!! (add user validation)
router.post(
    '/messages',
    async(req: express.Request, res: express.Response) => {
        const latestMessage: Message | null = await MessageModel.findOne({}, {}, {sort: { submittedAt: -1 }});
        if (latestMessage && latestMessage.username === req.body.username) {
            res.json({
                messageCreation: false,
                message: 'Übermittlung der Nachricht fehlgeschlagen.',
                reason: 'Die letzte Nachricht kam von dir.'
            })
        } else {
            const message = await MessageModel.create(req.body);
            res.json({
                messageCreation: true,
                message: 'Nachricht wurde übermittelt.',
                content: message
            })
        }
    }
)

router.patch(
    '/messages',
    async (req: express.Request, res: express.Response) => {
        const message = await MessageModel.findByIdAndUpdate(req.body._id, req.body);
        if (message) {
            res.json({
                messageCreation: true,
                message: 'Deine Nachricht wurde editiert.',
                content: message
            })
        } else {
            res.json({
                messageCreation: false,
                message: 'Nachricht konnte nicht editiert werden.',
                reason: 'Nachricht nicht gefunden.'
            })
        }
    }
)

export default router;