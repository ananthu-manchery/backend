//userRoutes
const express=require("express")
const router=express.Router()
const userController=require("../controllers/userController")

router.post('/signup',userController.createUser)
router.post('/signin',userController.loginUser)



// Admin routes
router.get('/', userController.getAllUsers); // Fetch all users
router.post('/ban/:userId', userController.banUser); 
router.post('/unban/:userId', userController.unbanUser); 

 
// Forgot Password & Reset Password Routes
router.post('/forgot-password', userController.forgotPassword); // For requesting a reset
router.post('/reset-password/:token', userController.resetPassword); // For resetting password

module.exports=router