const db = require("./db");
const writeRealtions = require("./utils/writeRealations");

module.exports.getEntity = (req, res, next) => {
  const { serverId } = req.params;
  try {
    const entity = db.findById(serverId);
    res.status(200).json({
      code: 200,
      message: "Entity Data",
      data: {
        entity,
      },
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getAll = async (req, res, next) => {
  res.status(200).json({
    data: {
      servers: db.find(),
    },
  });
};

module.exports.postEntity = async (req, res, next) => {
  const { name } = req.body;
  const { id: userId } = req.user;
  console.log(req.user.roles);
  try {
    const id = Date.now();
    // create entry in database
    db.create({
      serverId: id,
      name,
      userId,
    });

    // map our entity id and user id in permify
    const { snap_token } = await writeRealtions({
      entityType: "server",
      entityId: id,
      relation: "owner", // currently static and will come from req.user.roles (zitadel)
      userId,
    });

    // update snap token in db
    db.update({ serverId: id, name, snap_token, userId });

    res.status(201).json({
      code: 201,
      message: "Entity Created",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.putEntity = async (req, res, next) => {
  const { serverId, name } = req.body;
  try {
    db.update({ serverId, name });

    res.status(200).json({
      code: 200,
      message: "Entity Update",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteEntity = (req, res, next) => {
  const { serverId } = req.body;
  try {
    db.delete(serverId);
    res.status(200).json({
      code: 200,
      message: "Entity deleted",
    });
  } catch (err) {
    next(err);
  }
};
