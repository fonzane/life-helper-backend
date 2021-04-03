import express from 'express';
import passport from 'passport';
const router = express.Router();
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from '../../node_modules/dotenv';
const env = dotenv.config();

interface User {
    _id?: string;
    email: string;
    password: string;
    username: string;
    birthday: Date;
}

router.get(
    '/auth/validate-user',
    async (req: express.Request, res: express.Response) => {
        console.log(req.headers);
        res.json({moin: 'moin'});
    }
)

router.post(
    '/auth/register',
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        passport.authenticate('register', async (err: any, user: any, info:any ) => {
            if(err) { 
                console.log(err);
                return
            };
            if(user) {
                console.log("create user", user);
                const newUser = await User.create(req.body);
                const body = { _id: newUser._id, email: newUser.email, name: newUser.username };
                const token = jwt.sign({ user: body}, 'TOP_SECRET');
                res.json({
                    ...info,
                    token: token
                })
            } else {
                console.log("user already exists");
                console.log(info);
                res.json(info);
            }
        })(req, res, next);
    },
)

router.post(
    '/auth/login',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        passport.authenticate('login', (err: any, user: any, info: any) => {
            if (err) {
                console.log(err);
                return
            }
            console.log(info);
            if(user) {
                const body = { _id: user._id, email: user.email, name: user.username };
                const token = jwt.sign({ user: body }, 'TOP_SECRET');
                res.json({
                    ...info,
                    token: token
                });
            } else {
                res.json(info);
            }
        })(req, res, next);
    }
)

// router.post(
//     '/auth',
//     passport.authenticate('local', { session: false }),
//     async(req, res, next) => {
//         const user = req.user;
//         const body = { _id: user._id, email: user.email };
//         const token = jwt.sign({ user: body }, 'TOP_SECRET');
//         return res.json({
//             ...req.authInfo,
//             token: token
//         });
//     }
// )

// router.post(
//     '/auth',
//     async (req, res, next) => {
//         console.log(req);
//         passport.authenticate('local', async(err, user, info) => {
//             if(err || !user) {
//                 const error = new Error('An error occurred.');
//             }
//             req.login(user, { session: false }, async(error) => {
//                 if(error) return next(error);
//                 const body = { _id: user._id, email: user.email };
//                 const token = jwt.sign({ user: body }, 'TOP_SECRET');
//                 return res.json({
//                     message: 'Authentication successful.',
//                     token: token
//                 });
//             })
//         });
//     }
// );

// router.post(
//     '/auth',
//     passport.authenticate('local', { session: false }),
//     async(req, res, next) => {
//         console.log(req.authInfo);
//         res.json({
//             message: 'Authentication successfull',
//             user: req.user
//         })
// });

export default router;