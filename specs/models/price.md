[Index](../index.md)

## Price Model

A simple price model. Price is returned in USDC

## What it looks like

```typescript
;[
  {
    address: string,
    price: number,
  },
]
```

## Price History Model

A simple historic price model.

## What it looks like

```typescript
    {
        [timestamp: string]: {
            price: number,
            blockNumber: number | string
        }
    }
```
