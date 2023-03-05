/**
 * @author: jdrydn <james@jdrydn.com> (https://github.com/jdrydn)
 * @license: MIT
 * @link: https://github.com/someimportantcompany/github-actions-aws-s3-env
 * @variation: 3c1b552680fe
 */
const core = require('@actions/core');
const dotenv = require('dotenv');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

function assert(value, err) {
  if (!value) {
    throw err;
  }
}

async function getEnvFile(from) {
  assert(typeof from === 'string', new TypeError('Expected from to be a string'));
  assert(from.startsWith('s3://'), new TypeError('Expected from string to start with s3://'));

  const Bucket = from.substring(5, from.indexOf('/', 5));
  const Key = from.substring(from.indexOf('/', 5) + 1);
  core.info(`Fetching env file from s3://${Bucket}/${Key}`);

  const client = new S3Client({});
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentType: 'text/plain',
  });
  const res = await client.send(command);
  const body = await res.Body.transformToString();
  return body;
}

module.exports = async function run() {
  try {
    const from = core.getInput('from', { required: true });
    const prefix = core.getInput('prefix');
    const masked = core.getInput('masked').toString() === 'true';
    const exportEnv = core.getInput('export-env').toString() !== 'false';
    const exportOutputs = core.getInput('export-outputs').toString() === 'true';

    const raw = await getEnvFile(from);
    const env = dotenv.parse(raw);
    core.debug(env);

    const listOutput = exportOutputs ? [] : undefined;

    for (const [key, value] of Object.entries(env)) {
      if ((exportEnv || exportOutputs) && masked) {
        core.setSecret(value);
      }
      if (exportEnv) {
        core.exportVariable(`${prefix}${key}`, value);
        core.info(`export ${prefix}${key}=${value}`);
      }
      if (exportOutputs) {
        core.setOutput(`env.${prefix}${key}`, value);
        listOutput.push(`${prefix}${key}=${value}`);
      }
    }

    if (exportOutputs) {
      core.setOutput('list', listOutput.join('\n'));
    }
  } catch (err) {
    core.setFailed(err.message);
  }
};

/* istanbul ignore next */
if (require.main === module) {
  module.exports();
}
