const assert = require('assert');
const rewire = require('rewire');

describe('@someimportantcompany/github-actions-aws-s3-env', () => {
  const action = rewire('./index');

  const mockCore = ({
    inputs = {},
    outputs = {},
    variables = {},
    secrets = [],
    stdout = [],
  } = {}) => ({
    getInput: key => inputs[key] ?? '',
    getOutput: key => outputs[key] ?? null,
    setOutput: (key, value) => outputs[key] = value,
    getFailed: () => outputs.failed ?? null,
    setFailed: value => outputs.failed = value,
    exportVariable: (key, value) => variables[key] = value,
    setSecret: value => secrets.push(value),
    debug: value => stdout.push(value),
    info: value => stdout.push(value),
    getStdout: () => stdout ?? [],
  });

  it('should fetch an env file from S3', async () => {
    const core = {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    assert.deepStrictEqual(core, {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
      },
      outputs: {},
      variables: {
        HELLO: 'world',
        HTTP_HOST: '0.0.0.0',
      },
      secrets: [],
      stdout: [
        'Fetching env file from s3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        { HELLO: 'world', HTTP_HOST: '0.0.0.0' },
        'export HELLO=world',
        'export HTTP_HOST=0.0.0.0',
      ],
    });
  });

  it('should fetch an env file from S3 with a prefix', async () => {
    const core = {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        prefix: 'FOO_',
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    assert.deepStrictEqual(core, {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        prefix: 'FOO_',
      },
      outputs: {},
      variables: {
        FOO_HELLO: 'world',
        FOO_HTTP_HOST: '0.0.0.0',
      },
      secrets: [],
      stdout: [
        'Fetching env file from s3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        { HELLO: 'world', HTTP_HOST: '0.0.0.0' },
        'export FOO_HELLO=world',
        'export FOO_HTTP_HOST=0.0.0.0',
      ],
    });
  });

  it('should fetch an env file from S3, masking the values', async () => {
    const core = {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        masked: true,
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    assert.deepStrictEqual(core, {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        masked: true,
      },
      outputs: {},
      variables: {
        HELLO: 'world',
        HTTP_HOST: '0.0.0.0',
      },
      secrets: [
        'world',
        '0.0.0.0',
      ],
      stdout: [
        'Fetching env file from s3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        { HELLO: 'world', HTTP_HOST: '0.0.0.0' },
        'export HELLO=world',
        'export HTTP_HOST=0.0.0.0',
      ],
    });
  });

  it('should fetch an env file from S3 & write to outputs instead of env', async () => {
    const core = {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        'export-env': false,
        'export-outputs': true,
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    assert.deepStrictEqual(core, {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        'export-env': false,
        'export-outputs': true,
      },
      outputs: {
        'env.HELLO': 'world',
        'env.HTTP_HOST': '0.0.0.0',
        list: (a => a.join('\n'))([
          'HELLO=world',
          'HTTP_HOST=0.0.0.0',
        ]),
      },
      variables: {},
      secrets: [],
      stdout: [
        'Fetching env file from s3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        { HELLO: 'world', HTTP_HOST: '0.0.0.0' },
      ],
    });
  });

  it('should fetch an env file from S3 & write nothing', async () => {
    const core = {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        'export-env': false,
        'export-outputs': false,
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    assert.deepStrictEqual(core, {
      inputs: {
        from: 's3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        'export-env': false,
        'export-outputs': false,
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [
        'Fetching env file from s3://someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
        { HELLO: 'world', HTTP_HOST: '0.0.0.0' },
      ],
    });
  });

  it('should fail if from is not a string starting with s3://', async () => {
    const core = {
      inputs: {
        from: 'https://s3.amazonaws.com/someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
      },
      outputs: {},
      variables: {},
      secrets: [],
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    assert.deepStrictEqual(core, {
      inputs: {
        from: 'https://s3.amazonaws.com/someimportantcompany.github.io/github-actions-aws-s3-env/example.env',
      },
      outputs: {
        failed: 'Expected from string to start with s3://',
      },
      variables: {},
      secrets: [],
      stdout: [],
    });
  });

});
