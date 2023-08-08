const Handlebars = require('handlebars');

// Helper to check if the review matches the accountId
Handlebars.registerHelper('isReviewByAccountId', function (reviewaccountId, options) {
    const Id = options.data.root.accountId || '';

    if (reviewaccountId === Id) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


module.exports = Handlebars;