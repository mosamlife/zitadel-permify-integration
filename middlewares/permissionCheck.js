const db = require("../db");
const { sendRequest } = require("../utils/http");

const getPermifyConfig = ({
  entityType,
  entityId,
  permission,
  userId,
  snapToken,
}) => {
  return {
    method: "POST",
    url: `${process.env.PERMIFY_URL_ENDPOINT}/v1/permissions/check`,
    data: {
      metadata: {
        schema_version: process.env.PERMIFY_SCHEMA_VERSION,
        snap_token: snapToken,
        depth: 20,
      },
      entity: {
        type: entityType,
        id: entityId,
      },
      permission: permission,
      subject: {
        type: "user",
        id: userId,
      },
    },
  };
};

module.exports = ({ permission, entityType }) => {
  return async (req, res, next) => {
    try {
      const serverId = req.body?.serverId || req.params?.serverId;
      const { id: userId } = req.user;
      if (!serverId) {
        const err = new Error("invalid Params");
        err.statusCode = 422;
        throw err;
      }

      const { snap_token } = db.findById(serverId);

      const result = await sendRequest(
        getPermifyConfig({
          permission,
          entityType,
          entityId: serverId,
          userId,
          snapToken: snap_token,
        })
      );

      if (result.can !== "RESULT_ALLOWED") {
        const err = new Error("Not Allowed");
        err.statusCode = 401;
        throw err;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
