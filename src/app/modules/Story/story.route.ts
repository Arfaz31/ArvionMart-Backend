import { Router } from 'express'

import { validateRequestedFileData } from '../../middleware/validateRequestedFileData'

import { updloadSingleImage } from '../../config/cloudinary/multer.config'
import { StoryValidation } from './story.validation'
import { StoryController } from './story.controller'

const router = Router()

router.post(
  '/create-story',
  // auth(UserRole.admin, UserRole.superAdmin),
  updloadSingleImage('story-image'),
  validateRequestedFileData(StoryValidation.StorySchemaValidation),
  StoryController.createStoryIntoDB
)

router.get('/all-story', StoryController.getAllStoryFromDB)
router.get('/all-active-story', StoryController.getActiveStory)

router.patch(
  '/update-story/:id',
  updloadSingleImage('story-image'),
  validateRequestedFileData(StoryValidation.updateStorySchemaValidation),
  StoryController.updateStoryIntoDB
)

router.delete('/delete-story/:id', StoryController.deleteStoryFromDB)

export const StoryRoutes = router
