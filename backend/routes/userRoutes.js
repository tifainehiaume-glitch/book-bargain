/* définit les URLs liées aux utilisateurs */
 
const express        = require('express');
const router         = express.Router();
const UserController = require('../controllers/UserController');
const auth           = require('../middleware/auth');
 
/* routes publiques */
router.post('/register', UserController.register);  
router.post('/login',    UserController.login);     
 
/* routes protégées */
router.get('/profile',    auth, UserController.getProfile);     
router.put('/profile',    auth, UserController.updateProfile);  
router.delete('/profile', auth, UserController.deleteAccount);  
 
module.exports = router;