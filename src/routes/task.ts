import express from 'express';
import TaskModel, { Task } from '../models/Task';
import CategoryModel, { Category } from '../models/Category';
const router = express.Router();

router.get(
    '/tasks',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers.userid?.toString();
        const tasks = await TaskModel.find({ userID: userID });
        res.json(tasks);
    }
)

router.patch(
    '/tasks',
    async (req: express.Request, res: express.Response) => {
        console.log(req.body);
        if (!req.body.categoryName) {
            const userID = req.headers.userid?.toString()
            const filter = { userID: userID, _id: req.body.task._id };
            const task = await TaskModel.findOneAndUpdate( filter, req.body.task, {new: true} );
            res.json({
                message: 'Task updated',
                task
            });
        } else if (req.body.categoryName) {
            await TaskModel.deleteMany({'category.name': req.body.categoryName});
            const tasks = await TaskModel.create(req.body.task);
            res.json(tasks);
        }
    }
)

function updateListSort(categoryName: string, oldIndex: number, newIndex: number) {
    const filter = { listSort: oldIndex, 'category.name': categoryName };
    return TaskModel.findOneAndUpdate(filter, { listSort: newIndex }, {new: true});
}

router.post(
    '/tasks',
    async (req: express.Request, res: express.Response) => {
        const category: Category | null = await CategoryModel.findOne({
            name: req.body.category.name, 
            userID: req.body.category.userID
        });
        if(category) {
            const task: Task = req.body;
            await TaskModel.create(task);
            task.createdAt = new Date();
            console.log("New task created: ", task.name);
            res.json({
                task: task,
                message: 'Neue Aufgabe erfolgreich erstellt.',
                taskCreation: true
            });
        } else {
            console.log(`${req.body.userID} tried to create a task, but category couldn't be found.`);
            res.json({
                message: 'Aufgabenerstellung fehlgeschlagen.',
                taskCreation: false,
                reason: 'Konnte Kategorie nicht finden.'
            })
        }
    }
)

router.delete(
    '/delete',
    async (req: express.Request, res: express.Response) => {
        const userID = req.headers.userid?.toString()
        const filter = { userID: userID, _id: req.query.taskID}
        const task = await TaskModel.deleteOne(filter);
        res.json(task);
    }
)

export default router;



// console.log(req.body);
//         if(!req.body.categoryName) {
//             const userID = req.headers.userid?.toString()
//             const filter = { userID: userID, _id: req.body.task._id };
//             const task = await TaskModel.findOneAndUpdate( filter, req.body.task, {new: true} );
//             res.json({
//                 message: 'Task updated',
//                 task
//             })
//         } else if (req.body.move) {
//             const filter = { userID: req.body.task.userID, 'category.name': req.body.task.category.name };
//             const tasks = await TaskModel.find(filter);
//             const currIndex = req.body.currIndex;
//             const prevIndex = req.body.prevIndex;
//             const categoryName = req.body.task.category.name;

//             if(currIndex < prevIndex) {
//                 updateListSort(categoryName, prevIndex, currIndex).then(task => console.log(task));
//                 for(let i = currIndex; i < prevIndex; i++) {
//                     updateListSort(categoryName, i, i+1).then(task => console.log(task?.listSort));
//                 }
//             } else if (prevIndex > currIndex) {
//                 updateListSort(categoryName, prevIndex, currIndex).then(task => console.log(task?.listSort))
//                 for (let i = currIndex; i > prevIndex; i++) {
//                     updateListSort(categoryName, i, i-1).then(task => console.log(task));
//                     tasks[i].listSort -= 1;
//                 }
//             }

//             res.json(tasks);
//         }