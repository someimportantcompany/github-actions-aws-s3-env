# Slack Message

<!-- [![GitHub](https://badge.fury.io/gh/someimportantcompany%2Fgithub-actions-aws-s3-env.svg)](https://badge.fury.io/gh/someimportantcompany%2Fgithub-actions-aws-s3-env) -->
[![CICD](https://github.com/someimportantcompany/github-actions-aws-s3-env/workflows/CICD/badge.svg?branch=master&event=push)](https://github.com/someimportantcompany/github-actions-aws-s3-env/actions?query=workflow%3ACICD)
[![Coverage](https://coveralls.io/repos/github/someimportantcompany/github-actions-aws-s3-env/badge.svg)](https://coveralls.io/github/someimportantcompany/github-actions-aws-s3-env)

Fetch an `.env`-formatted file from AWS S3, and populate your Github Workflow with its contents. You can optionally prefix all variable names, enable variable masking (for secrets) & decrypt files once received from S3.

```yml
- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/prod.env

- uses: someimportantcompany/github-actions-aws-s3-env@v1
  with:
    from: s3://mybucket/path/to/secret.env
    # prefix: MY_SECRETS_
    # masked: true
```
