import express from 'express';
import Problem from '/model/problem';
import User from '/model/user';
import wrap from 'express-async-wrap';
import _ from 'lodash';
import fs from 'fs-extra';
import config from '/config';
import path from 'path';
import ProblemResult from '/model/problemResult';
import { checkProblem } from '/utils';

const router = express.Router();

router.get('/', wrap(async (req, res) => {
  const isUser = req.user;
  const isTA = req.user && (req.user.isAdmin() || req.user.isTA());
  var ids= req.user ? req.user.groups : [];
  if(!ids) ids=[];
  ids=await Promise.all(ids.map(id => User.findOne({ "meta.id": id })));
  ids=ids.filter(user => user!=null).map(user => user._id);
  ids.push(req.user._id);
  const data = await Problem.aggregate([
    { $match: isUser ? (isTA ? {} : { visible: true }) : { _id: -2 } }, // no problem has _id == -2 => can't see problem when not logged in
    {
      $project: {
        _id: 1, quota: 1, name: 1, visible: 1
      }
    },
    ...(req.user ? [{
      $lookup: {
        from: ProblemResult.collection.name,
        as: 'userRes',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              user: { $in: ids},
              $expr: {
                $eq: ['$$id', '$problem']
              }
            }
          }, {
            $limit: 1
          }
        ]
      }
    }] : []),
    {
      $unwind: {
        path: '$userRes',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        quota: 1,
        name: 1,
        visible: 1,
        userRes: { $ifNull: ['$userRes', { AC: false, points: 0 }] }
      }
    },
    { $project: { _id: 1, 'userRes.AC': 1, 'userRes.points': 1, quota: 1, name: 1, visible: 1 } }
  ]).sort('_id');
  res.send(data);
}));

router.get('/:id', wrap(async (req, res) => {
  if (isNaN(req.params.id)) return res.status(400).send('id must be a number');
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.sendStatus(404);
  let problem;
  if (req.user) {
    if (req.user.isAdmin() || req.user.isTA()) problem = await Problem.findOne({ _id: id });
    else problem = await Problem.findOne({ _id: id, visible: true });
  } else {
    return res.sendStatus(404); // can't view problem when not logged in
  }

  if (!problem) {
    return res.sendStatus(404);
  }

  problem = problem.toObject();

  try {
    const fl = await fs.readFile(
      path.join(config.dirs.problems, req.params.id, 'prob.md')
    );

    problem.desc = fl.toString();
  } catch (e) {
    problem.desc = '';
  }

  res.send(problem);
}));

router.get('/:id/assets/:path',
  checkProblem(),
  wrap(async (req, res) => {
    if (isNaN(req.params.id)) return res.status(400).send('id must be a number');

    const pathname = req.params.path;
    if (!pathname || !pathname.match(/^[A-Za-z.0-9]+$/)) { return res.sendStatus(404); }

    const filepath = path.join(config.dirs.problems, `${req.params.id}`, 'assets', pathname);
    try {
      await fs.access(filepath, fs.constants.R_OK);
    } catch (e) {
      return res.sendStatus(404);
    }

    res.sendFile(filepath);
  }));

export default router;
