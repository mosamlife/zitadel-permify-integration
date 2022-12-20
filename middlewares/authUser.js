const { sendRequest } = require("../utils/http");

const getRolesConfig = (token) => {
  return {
    method: "POST",
    url: `${process.env.SSO_ENDPOINT}/auth/v1/permissions/me/_search`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getProfileConfig = (token) => {
  return {
    method: "GET",
    url: `${process.env.SSO_ENDPOINT}/auth/v1/users/me`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  try {
    const [tokenType, authToken] = authHeader?.split(" ");
    if (tokenType !== "Bearer" || !authToken) {
      const err = new Error("Auth token missing");
      err.statusCode = 401;
      throw err;
    }

    const [userRes, rolesRes] = await Promise.all([
      sendRequest(getProfileConfig(authToken)),
      sendRequest(getRolesConfig(authToken)),
    ]);

    // user details from zitadel
    req.user = userRes?.user;
    // All the roles of this user
    req.user.roles = rolesRes?.result;

    next();
  } catch (err) {
    next(err);
  }
};
