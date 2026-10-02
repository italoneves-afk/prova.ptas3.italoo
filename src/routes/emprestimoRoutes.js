import { Router } from 'express';
import * as emprestimoController from '../controllers/emprestimoController.js';

const router = Router();

router.get('/', emprestimoController.listar);
router.get('/:id', emprestimoController.obter);
router.post('/', emprestimoController.criar);
router.put('/:id', emprestimoController.substituir);
router.patch('/:id', emprestimoController.atualizarParcialmente);
router.delete('/:id', emprestimoController.devolver);

export default router;