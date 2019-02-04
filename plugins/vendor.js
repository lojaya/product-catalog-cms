import lodash from 'lodash';
import moment from 'moment';

export default (context, inject) => {
    inject('_', lodash);
    inject('moment', moment);
};
