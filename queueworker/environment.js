const {
  DB_HOST = "",
  DB_PORT = "", 
  DB_USERNAME = "",
  DB_PASSWORD = ""
} = process.env;

module.exports = {
  DB_HOST,
  DB_PORT, 
  DB_USERNAME,
  DB_PASSWORD
};
