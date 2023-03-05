# AWS S3 ENV

[![GitHub](https://badge.fury.io/gh/someimportantcompany%2Fgithub-actions-aws-s3-env.svg)](https://github.com/someimportantcompany/github-actions-aws-s3-env)
[![CICD](https://github.com/someimportantcompany/github-actions-aws-s3-env/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/someimportantcompany/github-actions-aws-s3-env/actions?query=workflow%3ACI)
[![Coverage](https://coveralls.io/repos/github/someimportantcompany/github-actions-aws-s3-env/badge.svg)](https://coveralls.io/github/someimportantcompany/github-actions-aws-s3-env)

Fetch an `.env`-formatted file from AWS S3, and populate your Github Workflow with its contents. You can optionally prefix all variable names, or enable variable masking (for secrets).

## Usage

```yml
# Required, to set AWS credentials for S3
- uses: aws-actions/configure-aws-credentials@v1

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/prod.env
# env.HELLO=world
# env.HTTP_HOST=0.0.0.0
# env.SECRET_KEY=some-important-secret

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/secret.env
    # prefix: MY_SECRETS_
    # masked: true
```

> **You must configure the AWS environment** with [`aws-actions/configure-aws-credentials`](https://github.com/marketplace/actions/configure-aws-credentials-action-for-github-actions) [or equivalent](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html), as you cannot fetch files from S3 without credentials (even public files).

### Prefixing env vars

Prefix all env var keys, to avoid clashing with existing/other environment variables.

```yml
# Required, to set AWS credentials for S3
- uses: aws-actions/configure-aws-credentials@v1

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/prod.env
    prefix: MYPROJECT_
# env.MYPROJECT_HELLO=world
# env.MYPROJECT_HTTP_HOST=0.0.0.0
# env.MYPROJECT_SECRET_KEY=some-important-secret
```

### Masking env vars

Mask all env var values in the Github Workflow console, useful if this contains secrets.

```yml
# Required, to set AWS credentials for S3
- uses: aws-actions/configure-aws-credentials@v1

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/secrets.env
    masked: true
# env.HELLO=*****
# env.HTTP_HOST=*******
# env.SECRET_KEY=*********************
```

### Output as list

Instead of writing the env vars to the workflow environment, you can write the values to `outputs` instead. Useful if passing directly into other List arguments, such as [`docker/build-push-action`](https://github.com/marketplace/actions/build-and-push-docker-images)'s `build-arg` input.

```yml
# Required, to set AWS credentials for S3
- uses: aws-actions/configure-aws-credentials@v1

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  id: env-vars
  with:
    from: s3://mybucket/path/to/build-args.env
    export-env: false
    export-outputs: true
# steps.env-vars.outputs.list: |
#   HELLO=world
#   HTTP_HOST=0.0.0.0
#   SECRET_KEY=some-important-secret

- uses: docker/build-push-action@v4
  with:
    tags: myproject/app:latest
    push: true
    build-args: ${{ steps.env-vars.outputs.list }}
```

## Inputs

Key | Description
---- | ----
`from` | **Required**. An S3 url starting with `s3://`.
`prefix` | Optionally prefix all injected environment keys to avoid clashing with existing env vars.
`masked` | Optionally set to `true` to mask all values from output.
`export-env` | Optionally set to `false` to not write the env vars to the current environment.
`export-outputs` | Optionally set to `true` to write the env vars to `outputs.list`.

## Notes

- Any questions or suggestions [please open an issue](https://github.com/someimportantcompany/github-actions-aws-s3-env/issues).
