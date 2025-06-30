# 🔗 Algorand Integration Setup Guide with Nodely

This guide explains how to set up Algorand blockchain integration for the EthicGuard platform to enable immutable audit trails and privacy policy NFT minting in production.

## 🚀 Quick Setup

### 1. Create an Algorand Account

1. **Install a Wallet**:
   - [Pera Wallet](https://perawallet.app/) (mobile)
   - [MyAlgo Wallet](https://wallet.myalgo.com/) (web)
   - [AlgoSigner](https://www.purestake.com/technology/algosigner/) (browser extension)

2. **Create a New Account**:
   - Follow the wallet's instructions to create a new account
   - **CRITICAL**: Securely save your 25-word mnemonic phrase
   - Fund your account with Algos (for TestNet, use the [Algorand TestNet Dispenser](https://bank.testnet.algorand.network/))

### 2. Get API Access with Nodely

1. **Sign up for Nodely**:
   - Go to [Nodely.io](https://nodely.io)
   - Create an account and subscribe to a plan
   - Generate an API key

2. **Alternative Options**:
   - [PureStake](https://developer.purestake.io/) (alternative API provider)
   - [Run your own Algorand node](https://developer.algorand.org/docs/run-a-node/setup/install/) (for advanced users)

### 3. Configure Environment Variables

Update your `.env` file with the Algorand configuration:

```bash
# Algorand Configuration
VITE_ALGORAND_API_KEY=your_nodely_api_key
VITE_ALGORAND_NETWORK=testnet  # or mainnet for production
VITE_ALGORAND_ACCOUNT_ADDRESS=your_algorand_account_address
VITE_ALGORAND_ACCOUNT_MNEMONIC=your_25_word_mnemonic_phrase
```

**SECURITY WARNING**: The account mnemonic gives full access to your Algorand account. In production:
- Use a dedicated account with limited funds
- Consider using a secure key management system
- Implement proper access controls

### 4. Test the Integration

1. Go to Settings → Blockchain Settings in the EthicGuard dashboard
2. Enter your Algorand configuration
3. Check "Use Nodely for Algorand integration"
4. Click "Test Algorand Connection"
5. If successful, you'll see a confirmation message

## 🔧 Technical Details

### Nodely Integration

Nodely provides a simplified interface to the Algorand blockchain with these advantages:
- Simplified API for NFT creation and management
- Higher rate limits than standard Algorand APIs
- Automatic retries and error handling
- Built-in IPFS integration
- Comprehensive analytics and monitoring

### NFT Creation Process

When minting a Privacy Policy NFT or creating an audit record, the system:

1. **Prepares Metadata**:
   - Hashes the content using SHA-256
   - Adds timestamp, version, and other metadata

2. **Creates an Algorand Standard Asset (ASA)**:
   - Total supply: 1 (non-fungible)
   - Unit name: "EGNFT"
   - Asset name: "EthicGuard-[Type]-[Timestamp]"
   - URL: Description or IPFS link
   - Metadata hash: SHA-256 hash of the content
   - Note field: JSON metadata (base64 encoded)

3. **Records Transaction Details**:
   - Transaction ID
   - Block height
   - Timestamp
   - Asset ID

### Verification Process

To verify a record:

1. Retrieve the ASA details from Algorand blockchain
2. Verify the metadata hash matches the original content
3. Check the transaction details and confirmation status

## 🔍 Troubleshooting

### Common Issues

**"Failed to initialize Algorand client"**:
- Check your API key is correct
- Verify network connectivity to Nodely servers
- Ensure you're using the correct network (TestNet/MainNet)

**"Insufficient funds for transaction"**:
- Add more Algos to your account
- For TestNet, use the [Algorand TestNet Dispenser](https://bank.testnet.algorand.network/)

**"Transaction failed"**:
- Check account has sufficient Algos for transaction fees
- Verify account has permission to create assets
- Check network status

### Debug Steps

1. **Check Algorand Connection**:
   ```javascript
   // In browser console
   const status = await blockchainService.testConnection();
   console.log(status);
   ```

2. **Verify Account Balance**:
   - Use [AlgoExplorer](https://testnet.algoexplorer.io/) to check your account balance
   - Enter your account address in the search bar

3. **Monitor Transactions**:
   - Use [AlgoExplorer](https://testnet.algoexplorer.io/) to view transaction history
   - Check transaction status and details

## 📚 Additional Resources

- [Nodely Documentation](https://docs.nodely.io)
- [Algorand Developer Documentation](https://developer.algorand.org/docs/)
- [Algorand Standard Assets (ASA) Guide](https://developer.algorand.org/docs/features/asa/)
- [AlgoSDK JavaScript Documentation](https://algorand.github.io/js-algorand-sdk/)

## 🚀 Production Recommendations

For production deployments:

1. **Security**:
   - Use a dedicated Algorand account with limited funds
   - Store the mnemonic in a secure key management system (AWS KMS, HashiCorp Vault, etc.)
   - Implement proper access controls and audit logging

2. **Performance**:
   - Use Nodely for optimal performance and reliability
   - Implement caching for blockchain queries
   - Use batch processing for high-volume operations

3. **Monitoring**:
   - Set up alerts for failed transactions
   - Monitor account balance to ensure sufficient funds
   - Track transaction confirmation times

4. **Compliance**:
   - Document all blockchain interactions for regulatory purposes
   - Implement data retention policies for sensitive information
   - Consider legal implications of storing data on a public blockchain

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Nodely and Algorand documentation
3. Contact Nodely support at support@nodely.io
4. Include relevant configuration (without exposing secrets)

---

This setup enables immutable audit trails and verifiable compliance records using Algorand blockchain technology with Nodely integration for optimal performance and reliability.