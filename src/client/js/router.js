import Vue from 'vue';
import VueRouter from 'vue-router';
import Problems from './components/problems';
import Problem from './components/problem';
import Submit from './components/submit';
import Admin from './components/admin';
import TA from './components/ta';
import Submissions from './components/submissions';
import Submission from './components/submission';
import Diff from './components/diff';
import Home from './components/home';
import Profile from './components/profile';
import ProblemStatistic from './components/statistic/problem';
import ProblemScoreboard from './components/scoreboard/problem';
import HomeworkStatistic from './components/statistic/homework';
import HomeworkScoreboard from './components/scoreboard/homework';

Vue.use(VueRouter);

const router = new VueRouter({
    linkActiveClass: 'active',
});

router.map({
    '/': {
        component: Home,
    },
    '/problems': {
        name: 'problems',
        component: Problems,
    },
    '/problem/:id': {
        name: 'problem',
        component: Problem,
    },
    '/problem/:id/statistic': {
        name: 'problem.statistic',
        component: ProblemStatistic,
    },
    '/problem/:id/scoreboard': {
        name: 'problem.scoreboard',
        component: ProblemScoreboard,
    },
    '/homework/:id/statistic': {
        name: 'homework.statistic',
        component: HomeworkStatistic,
    },
    '/homework/:id/scoreboard': {
        name: 'homework.scoreboard',
        component: HomeworkScoreboard,
    },
    '/submissions': {
        name: 'submissions',
        component: Submissions,
    },
    '/submission/:id': {
        name: 'submission',
        component: Submission,
    },
    '/diff/:id/:id2': {
        name: 'diff',
        component: Diff,
    },
    '/submit/:id': {
        name: 'submit',
        component: Submit,
    },
    '/admin': {
        name: 'admin',
        component: Admin.index,
        subRoutes: {
            '/problems': {
                component: Admin.problems,
            },
            '/submissions': {
                name: 'admin.submissions',
                component: Admin.submissions,
            },
            '/homework/:id': {
                name: 'admin.homework',
                component: Admin.homework,
            },
            '/problem/:id': {
                name: 'admin.problem',
                component: Admin.problem,
            },
            '/newProblem': {
                component: Admin.newProblem,
            },
        },
    },
    '/ta': {
        name: 'ta',
        component: TA.index,
        subRoutes: {
            '/submissions': {
                name: 'ta.submissions',
                component: TA.submissions,
            },
        },
    },
    '/profile': {
        name: 'profile',
        component: Profile,
    }
});

router.redirect({
    '/admin': '/admin/problems',
    '/ta': '/ta/submissions',
});

export default router;
