var url = require("url");
var randomstring = require("randomstring");

/*
 * Holds application development configs and generic helper functions
 */
module.exports = {
  HOME_DIR: require("os").homedir(),
  imageResourceDir: function() {
    return this.HOME_DIR + "/Documents/threadly/images/";
  },
  imageResourceUrl: "/static/images/",
  resourceHost: "http://localhost:5000",
  getUtcTimestamp: function() {
    const now = new Date();
    return now.getTime() + now.getTimezoneOffset() * 60000;
  },
  getRandomString: function(n) {
    if (n) return randomstring.generate(n);
    return randomstring.generate();
  }
};