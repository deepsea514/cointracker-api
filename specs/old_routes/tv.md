[Index](../index.md)

## Trading View route

This document contains the specifications for the /tv route.

## /tv/config

Used to fetch the Trading view configuration. Returns a [Config](../models/config.md)

- Method: `GET`
- Body: `None`
- Headers: `None`
- Params: `None`
- Queries: `None`
- Access: `Public`
- Response: [Response](../models/response.md)
- Data: `{ config: object }`
- Examples:
  - `http://localhost:3000/api/v1/tv/config`
