require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://uyt8t:asd@localhost/development`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product } = sequelize.models;
const { Categories } = sequelize.models;
const { Users } = sequelize.models;
const { Order } = sequelize.models;
const { OrderLine } = sequelize.models;
const { Reviews } = sequelize.models;
const { Checkout } = sequelize.models;
const { Images } = sequelize.models;

//Asociaciones de Imagenes
Product.hasMany(Images);
Images.belongsTo(Product);

//Asociaciones de Order
Users.hasMany(Order);
Order.belongsTo(Users);

Order.hasMany(OrderLine);
Order.hasMany(Product);
OrderLine.belongsTo(Order);

//Asociaciones de review

Reviews.belongsTo(Users, { as: "author", allowNull: false });
Reviews.belongsTo(Product, { as: "product", allowNull: false });

// Product.hasMany(Reviews)

Product.belongsToMany(Categories, { through: "categoryTable" });
Categories.belongsToMany(Product, { through: "categoryTable" });
Product.belongsToMany(Order, { through: OrderLine });
Order.belongsToMany(Product, { through: OrderLine });

//Asociaciones de checkout
Users.hasMany(Checkout);
Checkout.belongsTo(Users);
Checkout.belongsTo(Order);

Users.prototype.checkPassword = function (password) {
  return (
    crypto
    .createHmac("sha1", this.salt)
    .update(password)
    .digest("hex") === this.password
  )
};
Users.prototype.randomSalt = function () {
  return crypto.randomBytes(20).toString('hex');
}

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
