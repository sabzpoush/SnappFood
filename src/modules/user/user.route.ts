import express, { Router } from 'express';
import * as auth from '../../middlewares/user.auth';           // Importing authentication middleware
import * as controller from './user.controller';               // Importing user controller functions
import * as middleware from '../../middlewares/code.validation'; // Importing validation middleware

const router: Router = express.Router();  // Initialize the Express router

// Route for signing up a new user
router.post('/sign', controller.signUp);

// Route for signing in an existing user
router.post('/login', controller.singIn);

// Combined sign-up or sign-in route with email validation
router.post('/signin', middleware.validateEmail, controller.signUpOrSignIn);

export default router;  // Export the router to be used in the main application