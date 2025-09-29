import { Router } from 'express';
import { DemoController } from './demo.controller';

const router = Router();

router.post('/', DemoController.createDemoData);
router.get('/', DemoController.getAllData);
router.get('/:id', DemoController.getSingleData);
router.patch('/:id', DemoController.updateDemoData);
router.delete('/:id', DemoController.deleteDemoData);

export const DemoRoutes = router;
