/* définit les URLs liées aux livres */

const express          = require('express');
const router           = express.Router();
const LivreController  = require('../controllers/LivreController');
const auth             = require('../middleware/auth');
 
/* routes publiques */
router.get('/',     LivreController.getAll);   
router.get('/:id',  LivreController.getOne);   
 
/* routes protégées */
router.get('/mes-livres', auth, LivreController.getMesLivres);  
router.post('/',          auth, LivreController.create);        
router.put('/:id',        auth, LivreController.update);        
router.delete('/:id',     auth, LivreController.delete);        
 
module.exports = router;