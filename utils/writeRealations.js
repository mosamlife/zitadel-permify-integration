const { sendRequest } = require("../utils/http");

const getConfig = ({ entityType, entityId, relation, userId }) => {
  return {
    url: `${process.env.PERMIFY_URL_ENDPOINT}/v1/relationships/write`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    data: {
      schema_version: process.env.PERMIFY_SCHEMA_VERSION,
      tuples: [
        {
          entity: {
            type: entityType,
            id: entityId?.toString(),
          },
          relation: "parent",
          subject: {
            type: "organization",
            id: process.env.ZITADEL_ORG_ID,
            relation: "...",
          },
        },
        {
          entity: {
            type: entityType,
            id: entityId?.toString(),
          },
          relation: relation,
          subject: {
            type: "user",
            id: userId,
            relation: "",
          },
        },
      ],
    },
  };
};

module.exports = async (obj) => {
  const result = await sendRequest(getConfig(obj));
  return result;
};
