import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const loadedFiles = loadFilesSync(`${__dirname}/**/*.typeDefs.js`, {
  extensions: ['js'],
});
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);
const typeDefs = mergeTypeDefs(loadedFiles);
const resolvers = mergeResolvers(loadedResolvers);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
