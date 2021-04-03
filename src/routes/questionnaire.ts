import express from 'express';
import { Document } from 'mongoose';
const router = express.Router();
import QuestionnaireModel, { Questionnaire } from '../models/Questionnaire';

router.get(
    '/questionnaires',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers.userid?.toString();
        if (userID) {
            console.log(req.method, req.url, userID);
            let questionnaires = await QuestionnaireModel.find({userID: userID});
            res.json(questionnaires);
        } else {
            console.log("Couldn't get userID while fetching questionnaires");
            res.json({
                questionnaires: null
            })
        }
    }
)

router.patch(
    '/questionnaire',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers.userid?.toString();
        const questionnaire = req.body;
        if (userID && questionnaire) {
            let updatedQuestionnaire: Document<Questionnaire> | null = await QuestionnaireModel.findOneAndUpdate({_id: questionnaire._id}, questionnaire, {new: true});
            if (updatedQuestionnaire === null) {
                res.json({
                    message: 'Das Update ist fehlgeschlagen.',
                    success: false
                });
                
            } else if (updatedQuestionnaire) {
                res.json({
                    message: 'Fragebogen erfolgreich geupdated.',
                    success: true,
                    questionnaire: updatedQuestionnaire.toJSON()
                })
            }
        }
    }
)

router.post(
    '/questionnaire',
    async (req: express.Request, res: express.Response) => {
        let questionnaire: Questionnaire;
        try {
            questionnaire = req.body;
            const newQuestionnaire = await QuestionnaireModel.create(questionnaire);
            console.log("New Questionnaire created.");
            res.json({
                newQuestionnaire,
                message: "Fragebogen wurde erstellt.",
                questionnaireCreation: true
            });
        } catch (err) {
            console.log("Couldn't create questionnaire.");
            console.log(err.message);
            res.json({
                message: "Fragebogen konnte nicht erstellt werden.",
                questionnaireCreation: false,
                reason: err.message
            })
            return;
        }
    }
)

router.delete(
    '/questionnaire',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers.userid?.toString();
        const questionnaireID = req.headers.id?.toString();
        console.log(req.headers);
        if(userID && questionnaireID) {
            const questionnaire = await QuestionnaireModel.deleteOne({_id: questionnaireID, userID: userID});
            console.log('questionnaire deleted', questionnaire);
            res.send({
                questionnaire,
                message: 'Fragebogen wurde gelöscht.',
                questionnaireDeletion: true
            })
        } else {
            console.log('Failed to delete Questionnaire: ', userID, questionnaireID);
            res.send({
                message: 'UserID oder FragebogenID nicht gefunden',
                questionnaireDeletion: false
            });
        }

})

export default router;