# Contributing to EthicGuard AI Firewall

We welcome contributions to the EthicGuard AI Firewall SDK! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- TypeScript knowledge

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-firewall-nodejs.git
   cd ai-firewall-nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📝 Development Workflow

### Code Style

We use ESLint and TypeScript for code quality:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Building

```bash
# Build TypeScript to JavaScript
npm run build

# Clean build directory
npm run clean
```

## 🔧 Project Structure

```
src/
├── index.ts              # Main SDK export
├── types.ts              # Type definitions
└── examples/             # Usage examples
    ├── basic-usage.js
    ├── openai-integration.js
    └── express-middleware.js

tests/
├── setup.ts              # Test configuration
└── firewall.test.ts      # Main test suite

dist/                     # Built JavaScript files
coverage/                 # Test coverage reports
```

## 📋 Contribution Guidelines

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Examples:
```
feat: add bias detection for financial content
fix: handle rate limiting in shield method
docs: update README with new examples
test: add integration tests for OpenAI
```

### Code Review Criteria

- ✅ Code follows TypeScript best practices
- ✅ All tests pass
- ✅ Code is well-documented
- ✅ No breaking changes (unless major version)
- ✅ Performance considerations addressed
- ✅ Security implications reviewed

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details**
   - Node.js version
   - SDK version
   - Operating system

2. **Reproduction steps**
   - Minimal code example
   - Expected vs actual behavior
   - Error messages/stack traces

3. **Additional context**
   - Screenshots if applicable
   - Related issues or PRs

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and problem it solves
3. **Provide examples** of how it would be used
4. **Consider backwards compatibility**

## 🔒 Security

For security vulnerabilities:

- **Do not** create public issues
- Email security@ethicguard.com
- Include detailed reproduction steps
- We'll respond within 48 hours

## 📚 Documentation

Help improve our documentation:

- Fix typos and unclear explanations
- Add more examples and use cases
- Improve API documentation
- Update README and guides

## 🎯 Areas for Contribution

We especially welcome contributions in:

- **New AI provider integrations** (Hugging Face, Cohere, etc.)
- **Additional detection models** (PII, sentiment, etc.)
- **Performance optimizations**
- **Better error handling**
- **More comprehensive tests**
- **Documentation improvements**
- **Example applications**

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and community support
- **Email**: support@ethicguard.com for direct support
- **Documentation**: https://docs.ethicguard.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be:

- Listed in our README
- Mentioned in release notes
- Invited to our contributor Discord
- Eligible for contributor swag

Thank you for helping make AI safer and more ethical! 🛡️