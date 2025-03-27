# TODO
 - [x] Models and ORM
 - [x] Backend routes
 - [ ] Auth Middleware
 - [ ] Public site
 - [ ] Activity column
 - [ ] SEO


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
- user_id
- slug
- name
- description
- content
- func_name
- level
- created_at
- updated_at

## Test
- challenge_id
- name
- inputs
- output

## Submission
- user_id
- challenge_id
- code
- complete
- complete_time
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


