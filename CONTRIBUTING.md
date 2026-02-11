# Contributing to claude-flow

Thanks for your interest in contributing to claude-flow!

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

## Building

```bash
npm run build
```

This runs `clean`, `update-version`, and builds ESM, CJS, and binary outputs.

## Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# With coverage
npm run test:coverage
```

Tests use Jest with `--experimental-vm-modules` for ESM support.

## Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run typecheck
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Make your changes
4. Run tests and linting
5. Commit with a clear message
6. Open a pull request

## Project Structure

- `src/` - TypeScript source code
- `dist/` - Compiled ESM output
- `dist-cjs/` - Compiled CJS output
- `bin/` - CLI entry points and compiled binaries
- `scripts/` - Build and test helper scripts

## Requirements

- Node.js >= 20.0.0
- npm >= 9.0.0
