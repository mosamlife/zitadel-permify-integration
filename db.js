let db = [];

module.exports.create = (obj) => db.push(obj);

module.exports.update = (obj) => {
  console.log(obj);
  const index = db.findIndex((val) => val.serverId == obj.serverId);
  console.log(index);
  if (index >= 0) db[index] = { ...db[index], ...obj };
  console.log({ ...db[index], ...obj });
};

module.exports.delete = (id) => {
  const updatedData = db.filter((val) => val.serverId != id);
  console.log(db, updatedData);
  db = updatedData;
};

module.exports.find = () => {
  return db;
};

module.exports.findById = (id) => {
  console.log(db, id);
  const index = db.findIndex((val) => val.serverId == id);
  console.log(index);
  if (index >= 0) return db[index];
  return {};
};
