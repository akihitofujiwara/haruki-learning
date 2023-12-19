const { chunk, pick } = require('lodash');

const docToData = (doc) => {
  return { ...pick(doc, ['id', 'ref', 'exists']), ...doc.data() };
};

const getDocumentData = async (ref) => {
  return docToData(await ref.get());
};

const getCollectionData = async (ref) => {
  return (await ref.get()).docs.map(docToData);
};

const getDocumentsData = async (refs) => {
  return await Promise.all(refs.map(getDocumentData));
};

const batch = async (db, data, f, chunkSize = 500, { firstBatch, beforeCommit = _ => _, onFailed, } = {}) => {
  const fn = async (x, data, i) => {
    const prevs = await x;

    const batch = (i === 0 && firstBatch != null) ? firstBatch : db.batch();
    const refs = await data.reduce(async (x, datum, i2) => {
      const prevs = await x;
      return [...prevs, await f(batch, datum, i * chunkSize + i2)];
    }, Promise.resolve([]));
    await beforeCommit({ index: i });
    try {
      await batch.commit();
    } catch(e) {
      const retry = (data) => fn(x, data, i);
      if(onFailed) {
        await onFailed(e, retry, data);
      } else {
        throw e;
      }
    }
    return [...prevs, ...refs];
  };

  return await chunk(data, chunkSize).reduce(fn, Promise.resolve([]));
};

module.exports = {
  docToData,
  getDocumentData,
  getCollectionData,
  getDocumentsData,
  batch,
};

