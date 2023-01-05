const shop = require("../controller/shop");
module.exports = function (app) {
  app.post("/addshop", shop.createShop);
  app.get("/getshop/:id", shop.getShop);
  app.get("/getshopdetail/:id", shop.getShopDetail);
  app.post("/deleteShop/:id", shop.deleteShop);
  app.post("/Editshop/:id", shop.Editshop);
  app.post("/shopgroup", shop.shopgroup);
  app.get("/getshopgroup/:id", shop.getshopgroup);
  app.get("/getShopnull/:id", shop.getShopnull);
  app.get("/getshopgroupid/:id", shop.getshopgroupid);
  app.get("/getshopgroupidjoint/:id", shop.getshopgroupidJoint);
  
};
