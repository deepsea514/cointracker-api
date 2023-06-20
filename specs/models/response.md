[Index](../index.md)

## Response Model

The standard response returned by all API routes

## What it looks like

```typescript
{
    success: boolean,
    data: object,
    errors: { code: number, name: string }[],
    message: string
}
```

## Contents

- `success` - Can be `true` or `false` depending on whether the operation succeeded or not.
- `data` - Holds data that is being returned by a call to the endpoint as an object. Specific details about the data can be found in the specs for the route.
- `errors` - Holds an Array of errors `{ code: number, name: string }[]`.
- `message` - Holds a message to describe the result of the operation or the contents of `error.message` in case of errors.
