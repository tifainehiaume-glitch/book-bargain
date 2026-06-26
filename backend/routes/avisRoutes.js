/* définit les URLs liées aux avis */
 
const express         = require('express');
const router          = express.Router();
const AvisController  = require('../controllers/AvisController');
const auth            = require('../middleware/auth');
 
/* routes publiques */
router.get('/user/:userId',         AvisController.getAvisUser);  
router.get('/user/:userId/moyenne', AvisController.getMoyenne);   
 
/* routes protégées */
router.post('/', auth, AvisController.create);  
 
module.exports = router;