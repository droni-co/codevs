# Models

## User
- slug
- name
- email
- provider
- provider_id
- created_at
- updated_at

## Challenge
- slug
- name
- user_id
- description
- content
- bolierplate
- level
- tags
- created_at
- updated_at

## Test
- challenge_id
- name
- inputs
- expected_output

## Submission
- user_id
- challenge_id
- code
- result
- time
- votes
- rank
- created_at
- updated_at

## Vote
- user_id
- submission_id
- vote

## Comment
- user_id
- challenge_id
- submission_id
- content
- created_at
- updated_at
