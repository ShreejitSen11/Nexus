# Contributing to Nexus GameFi Protocol

Thank you for considering contributing to Nexus! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Report bugs via GitHub Issues
- 💡 **Feature Requests**: Suggest new features
- 📝 **Documentation**: Improve or add documentation
- 🔧 **Code**: Submit pull requests
- 🧪 **Testing**: Write tests or test features
- 🌐 **Translation**: Translate documentation
- 💬 **Community**: Help others in Discord

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/Nexus.git
cd Nexus
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Development Guidelines

### Code Style

- Use ES6+ JavaScript
- Follow existing code formatting
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Commit Messages

Follow the conventional commits format:

```
feat: add new feature
fix: fix bug in asset registry
docs: update README
test: add tests for marketplace
refactor: improve code structure
style: format code
chore: update dependencies
```

### Testing

Always add tests for new features:

```bash
# Run all tests
npm test

# Run specific test
npm test -- path/to/test.js

# Run with coverage
npm run coverage
```

### Smart Contracts

For smart contract changes:

1. Write comprehensive tests
2. Document all functions
3. Consider gas optimization
4. Check for security issues
5. Update deployment scripts if needed

```bash
# Compile contracts
npm run compile-contracts

# Run contract tests
npm run test-contracts
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Submit PR with clear description
2. Wait for automated checks
3. Address reviewer feedback
4. Maintainer will merge when approved

## 🐛 Reporting Bugs

### Before Reporting

- Search existing issues
- Try latest version
- Gather system information

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node Version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 119]

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Problem Description**
What problem does this solve?

**Proposed Solution**
How would you solve it?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

## 📚 Documentation

Documentation improvements are always welcome!

### Areas to Document

- API endpoints
- Smart contract functions
- Integration examples
- Best practices
- Troubleshooting guides

### Documentation Style

- Clear and concise
- Include code examples
- Add diagrams if helpful
- Update table of contents
- Check for typos

## 🧪 Testing Guidelines

### Unit Tests

```javascript
describe('AssetRegistry', () => {
  it('should register a new asset', async () => {
    const result = await assetRegistry.registerAsset(...);
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

```javascript
describe('Marketplace Integration', () => {
  it('should complete full buy flow', async () => {
    // Setup
    // Execute
    // Assert
  });
});
```

## 🔒 Security

### Reporting Security Issues

**Do NOT create public issues for security vulnerabilities.**

Email: security@nexus.game

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

### Security Best Practices

- Never commit private keys
- Validate all inputs
- Use latest dependencies
- Follow OpenZeppelin standards
- Test edge cases

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: conduct@nexus.game

## 💬 Community

- **Discord**: https://discord.gg/nexus
- **Twitter**: @NexusGameFi
- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and features

## 🎓 Resources

### Learning Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Tutorial](https://hardhat.org/tutorial)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ethers.js Documentation](https://docs.ethers.org/)

### Project Resources

- [Architecture Overview](./ARCHITECTURE.md)
- [Smart Contracts Guide](./CONTRACTS.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [API Documentation](./README.md#api-documentation)

## 🙏 Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make Nexus better!

---

**Questions?** Feel free to ask in Discord or GitHub Discussions.
