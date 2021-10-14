# Steps to run

0. Run npm install and npm audit fix
0.5 uncomment lines 45-49 in truffle-config.js
1. Run the command - ganache-cli - to initialise the local blockchain (ethereum). It listens on localhost:8545
2. In another terminal tab, run the truffle compile and truffle migrate commands.
3. Open MetaMask extension in Chrome/Firefox. Connect to localhost 8545 and enter password.

 -- Create accounts

4. From the ganache-cli tab, copy 1 private key. Open metamask, and click on the top right account thumbnail.
5. Click the option to 'Import Account' and add your key. This is the seller account.
6. After entering, the new imported account will be active. Connect this account to the localhost by clicking the 'Not Connected'. There, connect this to the localhost.
7. Repeat steps 4-6 by taking another private key. This will be used for the bidder address. If you wish, create 2 bidders for better effect.

-- Running the application

8. Run the application with node app.js command (in the src folder). Run as required, but remember to switch between MetaMask accounts whenever switching between accounts.