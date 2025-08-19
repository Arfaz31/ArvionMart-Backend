import { Router } from 'express'
import { ContactInfoController } from './contactInfo.controller'

const router = Router()

router.post('/create', ContactInfoController.createContactInfoIntoDB)
router.get('/getall', ContactInfoController.getAllContactInfoFromDB)
router.patch('/update/:id', ContactInfoController.updateContactInfoIntoDB)
router.delete('/delete/:id', ContactInfoController.deleteContactInfoFromDB)

export const ContactInfoRoutes = router
