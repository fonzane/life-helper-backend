import express from 'express';
const router = express.Router();
import CategoryModel, { Category } from '../models/Category';

router.get(
    '/category',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers.userid?.toString();
        const categories = await CategoryModel.find({ userID: userID });
        res.json(categories);
    }
);

router.post(
    '/category',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers['userid']?.toString();
        const category: Category | null = await CategoryModel.findOne({ name: req.body.name, userID: userID });
        if(category) {
            console.log('Category creation failed. Category already exists.');
            res.json({
                message: 'Kategorie konnte nicht erstellt werden.',
                reason: 'Kategorie existiert bereits.',
                categoryCreation: false
            })
        } else if (!category) {
            const newCategory = await CategoryModel.create({ name: req.body.name, userID: userID });
            console.log('New Category created: ', newCategory.name);
            res.json({
                newCategory,
                message: 'Kategorie erfolgreich erstellt.',
                categoryCreation: true
            })
        }
    }
)

router.delete(
    '/category',
    async (req: express.Request, res: express.Response) => {
        const category = await CategoryModel.findOneAndDelete({ userID: req.headers.userid?.toString(), name: req.headers.name?.toString() });
        console.log(category);
        res.json(category);
    }
)

export default router;