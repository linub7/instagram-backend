import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const loadedFiles = loadFilesSync(`${__dirname}/**/*.typeDefs.js`, {
  extensions: ['js'],
});
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

export const typeDefs = mergeTypeDefs(loadedFiles);
export const resolvers = mergeResolvers(loadedResolvers);
