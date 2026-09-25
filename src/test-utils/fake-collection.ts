/**
 * test-utils/fake-collection.ts — A tiny in-memory stand-in for a MongoDB
 * collection, covering only the calls our storage modules make. Lets unit
 * tests run without MongoMemoryServer (which needs to download a binary).
 *
 * Filters support plain equality on top-level fields only.
 */

type Doc = Record<string, unknown>;
type Options = { projection?: Record<string, 0 | 1> };

function matches(doc: Doc, filter: Doc) {
  return Object.entries(filter).every(([key, value]) => doc[key] === value);
}

function project(doc: Doc, options?: Options): Doc {
  const projection = options?.projection;
  if (!projection) return { ...doc };
  const include = Object.entries(projection).filter(([k, v]) => v === 1 && k !== "_id").map(([k]) => k);
  if (include.length > 0) {
    return Object.fromEntries(include.filter((k) => k in doc).map((k) => [k, doc[k]]));
  }
  const excluded = Object.entries(projection).filter(([, v]) => v === 0).map(([k]) => k);
  return Object.fromEntries(Object.entries(doc).filter(([k]) => !excluded.includes(k)));
}

export function createFakeCollection() {
  let docs: Doc[] = [];
  let nextId = 1;

  return {
    docs: () => docs,
    reset: () => {
      docs = [];
    },
    async insertOne(doc: Doc) {
      const stored = { _id: `fake_${nextId++}`, ...doc };
      docs.push(stored);
      return { acknowledged: true, insertedId: stored._id };
    },
    find(filter: Doc = {}, options?: Options) {
      let results = docs.filter((d) => matches(d, filter));
      const cursor = {
        sort(spec: Record<string, 1 | -1>) {
          const [[key, dir]] = Object.entries(spec);
          results = [...results].sort((a, b) => String(a[key]).localeCompare(String(b[key])) * dir);
          return cursor;
        },
        async toArray() {
          return results.map((d) => project(d, options));
        },
      };
      return cursor;
    },
    async findOne(filter: Doc, options?: Options) {
      const doc = docs.find((d) => matches(d, filter));
      return doc ? project(doc, options) : null;
    },
    async findOneAndUpdate(filter: Doc, update: { $set: Doc }, options?: Options) {
      const doc = docs.find((d) => matches(d, filter));
      if (!doc) return null;
      Object.assign(doc, update.$set);
      return project(doc, options);
    },
    async countDocuments(filter: Doc) {
      return docs.filter((d) => matches(d, filter)).length;
    },
    async replaceOne(filter: Doc, replacement: Doc, options?: { upsert?: boolean }) {
      const index = docs.findIndex((d) => matches(d, filter));
      if (index >= 0) {
        docs[index] = { _id: docs[index]._id, ...replacement };
      } else if (options?.upsert) {
        docs.push({ _id: `fake_${nextId++}`, ...replacement });
      }
      return { acknowledged: true };
    },
    async deleteOne(filter: Doc) {
      const before = docs.length;
      docs = docs.filter((d) => !matches(d, filter));
      return { deletedCount: before - docs.length };
    },
  };
}
