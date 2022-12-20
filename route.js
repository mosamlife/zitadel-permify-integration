const express = require("express");

const controllers = require("./controller");
const authUser = require("./middlewares/authUser");
const permissionCheck = require("./middlewares/permissionCheck");

const router = express.Router();

router.get(
  "/server/:serverId",
  authUser,
  permissionCheck({ permission: "read", entityType: "server" }),
  controllers.getEntity
);

router.get("/all", controllers.getAll);
router.post("/server", authUser, controllers.postEntity);

router.put(
  "/server",
  authUser,
  permissionCheck({ permission: "edit", entityType: "server" }),
  controllers.putEntity
);

router.delete(
  "/server",
  authUser,
  permissionCheck({ permission: "delete", entityType: "server" }),
  controllers.deleteEntity
);

module.exports = router;
