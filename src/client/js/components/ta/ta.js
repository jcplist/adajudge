import Vue from 'vue';
import template from './ta.pug';

export default Vue.extend({
    data() {
        return { 
            submissions: [],
            curTabId: 0,
            tabRange: [0, 1, 2, 3, 4],
            filter: {
                result: 'ALL',
                probID: '',
                user: '',
                score: '',
            },
        };
    },
    ready() {
    },
});
