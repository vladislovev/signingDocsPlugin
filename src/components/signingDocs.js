import Web3 from 'web3'
/**
 * Name
 * Surname
 * Date
 * Wallet
 * Company
 * Massage
 * File’s hash
 */
class signingDocs {
    constructor (node, chainId) {
        
    }
    async signData(name, surname, date, company, massege, fileHash) {

        const provider = await detectEthereumProvider({
          mustBeMetaMask: true
        })
        if (provider) {
          try {
    
            const accounts = await provider.request({method: 'eth_requestAccounts'});
            const userWallet = accounts[0]
    
            const web3 = new Web3(this.node)
    
            const msgParams = JSON.stringify({
              domain: {
                chainId: this.chainId,
                name: company,
                verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                version: '1',
              },
              message: {
                Person: {
                  name: name,
                  surname: surname,
                  date: date,
                  wallet: userWallet
                },
                Company: company,
                Message: massege,
                Document: fileHash,
              },
              primaryType: 'Mail',
              types: {
                EIP712Domain: [
                  {name: 'name', type: 'string'},
                  {name: 'version', type: 'string'},
                  {name: 'chainId', type: 'uint256'},
                  {name: 'verifyingContract', type: 'address'}
                ],
                Data: [
                  {name: 'name', type: 'string'},
                  {name: 'surname', type: 'string'},
                  {name: 'date', type: 'string'},
                  {name: 'wallet', type: 'address'}
                ],
                Mail: [
                  {name: 'Person', type: 'Data'},
                  {name: 'Company', type: 'string'},
                  {name: 'Message', type: 'string'},
                  {name: 'Document ', type: 'string'}
                ]
              },
            });
    
            try {
              const from = accounts[0];
              var params = [from, msgParams];
              var method = 'eth_signTypedData_v4'
              return new Promise((resolve, reject) => {
    
                provider.sendAsync(
                    {
                      method,
                      params,
                      from,
                    }, async (err, result) => {
    
                      if (err) return console.dir(err);
                      if (result.error) {
                        alert(result.error.message);
                      }
                      if (result.error) return console.error('ERROR', result);
    
                      const succesData = (JSON.stringify(result.result))
                      console.log(succesData);
    
    
                      //const recovered = recoverTypedSignatureV4({
                      //  data: JSON.parse(msgParams),
                      //  sig: result.result,
                      //});
    
                      //let massage = JSON.parse(msgParams)
                      //console.log(massage.message);
    
                      //const recovered = await web3.eth.personal.ecRecover(JSON.parse(msgParams), succesData);
                      //console.log(recovered);
    
    
                      if (
                          from === from//toChecksumAddress(recovered) === toChecksumAddress(from)
                      ) {
                        alert('Successfully recovered signer as ' + from);
                        return resolve(succesData)
                      } else {
                        alert('Failed to verify signer when comparing ' + result + ' to ' + from);
                        reject(false)
                        return false
                      }
                    })
              })
            } catch (err) {
              alert(err);
            }
          } catch (e) {
            alert(e)
            return false
          }
        } else {
          console.error('Please install MetaMask')
          return false
        }
    
      }
}