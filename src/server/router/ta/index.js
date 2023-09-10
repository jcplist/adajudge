import express from 'express';
import {requireTA} from '/utils';
import Submission from './submission';

const router = express.Router();

router.use('/', requireTA);
router.use('/submission', Submission);

export default router;
