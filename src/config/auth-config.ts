import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import User from '../models/User';

import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done: (error: any, user?: any, options?: {message: string, auth: boolean}) => void) => {
            const user = await User.findOne({  email: email });
            if(user) {
                if(await user.isValidPassword(password)) {
                    return done(null, user, { message: 'Login successfull', auth: true });
                } else {
                    return done(null, false, { message: 'User exists, wrong password.', auth: false });
                }
            } else {
                return done(null, false, { message: "User doesn't exist", auth: false });
            }
        }
    )
);

passport.use(
    'register',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done: (error: any, user?: any, options?: {message: string, auth: boolean}) => void) => {
            let user = await User.findOne({ email: email });
            if(user) {
                return done(null, false, { message: 'User already exists', auth: false });
            } else {
                return done(null, true, { message: 'Create new user', auth: true });
            }
        }
    )
)

// passport.use(
//     'login',
//     new localStrategy(
//         {
//             usernameField: 'email',
//             passwordField: 'password'
//         },
//         async (email, password, done) => {
//             try {
//                 const user = await User.findOne({ email });

//                 if(!user) {
//                     return done(null, false, { message: 'User not found' });
//                 }

//                 const validate = await user.isValidPassword(password);

//                 if(!validate) {
//                     return done(null, false, { message: 'Wrong Password' });
//                 }

//                 return done(null, user, { message: 'Logged in Successfully' });
//             } catch (err) {
//                 return done(err)
//             }
//         }
//     )
// );

passport.use(
    new JWTStrategy({
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret-token')
    },
    async (token, done) => {
        try {
            return done(null, token.user);
        } catch (err) {
            done (err);
        }
    })
);