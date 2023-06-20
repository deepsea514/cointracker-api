[Index](../index.md)

## Auth route

This document contains the specifications for the /auth route.

## /auth/register

Used to register a user for API usage trial.

- Method: `POST`
- Body: `{ name, email, password}`
- Headers: `None`
- Params: `None`
- Queries: `None`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ user: { name: string, email: string }, auth: { token: string }, api: { key: string, secret: string } }`

## /auth/login

Used to login a user.

- Method: `POST`
- Body: `{ email, password}`
- Headers: `None`
- Params: `None`
- Queries: `None`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ user: { name: string, email: string }, auth: { token: string }, api: { key: string, secret: string } }`
