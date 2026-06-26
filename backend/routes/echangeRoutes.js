/* définit les URLs liées aux échanges */ 
const express             = require('express');
const router              = express.Router();
const EchangeController   = require('../controllers/EchangeController');
const auth                = require('../middleware/auth');
 
/* toutes les routes échanges sont protégées */
router.get('/',           auth, EchangeController.getMesEchanges); 
router.get('/:id',        auth, EchangeController.getOne);         
router.post('/',          auth, EchangeController.create);         
router.put('/:id/accept', auth, EchangeController.accept);         
router.put('/:id/refuse', auth, EchangeController.refuse);         
router.delete('/:id',     auth, EchangeController.delete);         
 
module.exports = router;