# EGØ Index

A compact, source-linked directory of egocentric datasets, pipelines, general models, robot policies, people, and organizations.

## Catalog

The canonical library is `app/catalog.json`, supplemented by the comparison-table records in `app/table-additions.ts`. Each record has a stable `id` and embeds its tags, release/access/scale metadata, citations and repository signals, institutions, and source-owned visual metadata.

## Development

```bash
npm ci
npm run dev
```

Validate a production build with `npm run build`.

## Data scope

Human egocentric work is the primary scope. Pure robot datasets and generic components are retained only when explicitly tagged as references.
