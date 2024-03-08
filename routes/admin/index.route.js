const dashboardRoutes = require("./dashboard.route");
const musicRoutes = require("./music.route");
const artistRoutes = require("./artist.route");
const albumRoutes = require("./album.route");
const systemConfig = require("../../config/system");
const categoryRoutes = require("./category.route");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard" ,dashboardRoutes);
    app.use(PATH_ADMIN + "/music", musicRoutes);
    app.use(PATH_ADMIN + "/artist", artistRoutes);
    app.use(PATH_ADMIN + "/album", albumRoutes);
    app.use(PATH_ADMIN + "/category", categoryRoutes);
}