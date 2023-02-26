# AWS S3 ENV

[![GitHub](https://badge.fury.io/gh/someimportantcompany%2Fgithub-actions-aws-s3-env.svg)](https://github.com/someimportantcompany/github-actions-aws-s3-env)
[![CICD](https://github.com/someimportantcompany/github-actions-aws-s3-env/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/someimportantcompany/github-actions-aws-s3-env/actions?query=workflow%3ACI)
[![Coverage](https://coveralls.io/repos/github/someimportantcompany/github-actions-aws-s3-env/badge.svg)](https://coveralls.io/github/someimportantcompany/github-actions-aws-s3-env)

Fetch an `.env`-formatted file from AWS S3, and populate your Github Workflow with its contents. You can optionally prefix all variable names, enable variable masking (for secrets) & decrypt files once received from S3.

## Usage

```yml
# Required, to set AWS credentials for S3
- uses: aws-actions/configure-aws-credentials@v1

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/prod.env

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/secret.env
    # prefix: MY_SECRETS_
    # masked: true
```

- You must configure the AWS environment with `aws-actions/configure-aws-credentials` or equivalent, as you cannot fetch files from S3 without credentials (even public files!)

## Inputs

Key | Description
---- | ----
`from` | **Required**. An S3 url starting with `s3://`
`prefix` | Optionally prefix all injected environment keys to avoid clashing with existing env vars
`masked` | Optionally set to `true` to mask all values from output

## Notes

- Any questions or suggestions [please open an issue](https://github.com/someimportantcompany/github-actions-aws-s3-env/issues).
