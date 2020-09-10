/**
 * Module dependencies.
 */
import passport from 'passport';
import strategy from "passport-jwt";
import mongoose from 'mongoose';
const User = mongoose.model('User');

const ExtractJWT = strategy.ExtractJwt;
const JWTStrategy = strategy.Strategy;

export default function () {
  // Use jwt strategy
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    },
    function (jwtPayload, done) {
      //find the user in db if needed
      return User.findById(jwtPayload._id).exec(function (err, user) {
        if (err) {
          return done(err);
        } else if (!user) {
          return done(null, false, {
            message: 'Invalid user!'
          });
        }

        return done(null, user);
      })
    }
  ));
}
